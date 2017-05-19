#include "ChannelCollector.h"

extern struct st_TThostFtdc STFTDC;
extern CThostFtdcTraderApi *TRDAPI;

MarketDataCollector::MarketDataCollector(CThostFtdcMdApi * api)
{
}


MarketDataCollector::~MarketDataCollector()
{
}

int MarketDataCollector::CtpMarketMainApi()
{
	CThostFtdcMdApi *api =
		CThostFtdcMdApi::CreateFtdcMdApi(STFTDC.FLOW_PATH, true, STFTDC.ISMULTICAST);
	MarketDataCollector mdCollector(this->MdApi = api);
	api->RegisterSpi(&mdCollector);
	api->RegisterFront(STFTDC.FRONT_ADDR);
	api->Init();
	api->Join();
	return 0;
}

/*
  0: 发送成功
 -1: 因网络原因发送失败
 -2: 未处理请求队列总数量超限。
 -3: 每秒发送请求数量超限。
*/
int MarketDataCollector::CtpMarketReqUserLogin()
{
	CThostFtdcReqUserLoginField req;
	memset(&req, 0, sizeof(req));
	strcpy(req.BrokerID, STFTDC.BROKER_ID);
	strcpy(req.UserID, STFTDC.USER_ID);
	strcpy(req.Password, STFTDC.PASSWORD);
	return iResult = TRDAPI->ReqUserLogin(&req, ++iRequestID);
	cerr << "--->>> 发送用户登录请求: " << ((iResult == 0) ? "成功" : "失败") << endl;
	void onRspUserLogin(CThostFtdcRspUserLoginField *pRspUserLogin,
		CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast);
}

// 第一个参数是一个包含所有要订阅的合约的数组
// 第二个参数是该数组的长度
int MarketDataCollector::CtpMarketSubscribe(char* arrayOfConracts[], int sizeOfArray)
{
	if (iResult == 0)
		return MdApi->SubscribeMarketData(arrayOfConracts, sizeOfArray);
	else
		return iResult;
}

int MarketDataCollector::CtpMarketUnSubscribe(char *arrayOfConracts[], int sizeOfArray)
{
	return MdApi->UnSubscribeMarketData(arrayOfConracts, sizeOfArray);
}

int MarketDataCollector::CtpMarketLogout(CThostFtdcUserLogoutField *req, int iRequestID)
{
	return MdApi->ReqUserLogout(req, iRequestID);
}

TradeChannel::TradeChannel(CThostFtdcTraderApi * api)
{
}

TradeChannel::~TradeChannel()
{
}

/*
订阅模式
 THOST_TERT_RESTART：	接收所有交易所当日曾发送过的以及之后可能会发送的所有该类消息。
 THOST_TERT_RESUME：	接收客户端上次断开连接后交易所曾发送过的以及之后可能会发送的所有该类消息。
 THOST_TERT_QUICK：		接收客户端登录之后交易所可能会发送的所有该类消息。
*/
int TradeChannel::CtpTradeMainApi()
{
	CThostFtdcTraderApi *api =
		CThostFtdcTraderApi::CreateFtdcTraderApi(STFTDC.FLOW_PATH);
	TradeChannel tdChnl(TRDAPI = api);
	api->RegisterSpi(&tdChnl);
	api->RegisterFront(STFTDC.FRONT_ADDR);
	api->SubscribePrivateTopic(THOST_TERT_QUICK);
	api->SubscribePublicTopic(THOST_TERT_QUICK);
	api->Init();
	api->Join();
	return 0;
}

int TradeChannel::getRtn()
{
	return iResult;
}

void TradeChannel::OnFrontConnected()
{
	cerr << "--->>> " << "OnFrontConnected" << endl;
	///用户登录请求
	CtpTrdReqUserLogin();
}

bool TradeChannel::IsErrorRspInfo(CThostFtdcRspInfoField *pRspInfo)
{
	// 如果ErrorID != 0, 说明收到了错误的响应
	bool bResult = ((pRspInfo) && (pRspInfo->ErrorID != 0));
	if (bResult)
		cerr << "--->>> ErrorID=" << pRspInfo->ErrorID << ", ErrorMsg=" << pRspInfo->ErrorMsg << endl;
	return bResult;
}

/*
身份认证功能是否启用在期货公司的业务人员使用的结算平台上是可以进行配置的。期货公司可以选择关闭身份认证功能
则客户端可不必进行身份认证。否则期货公司需要在结算平台上维护该客户端程序的认证码（AuthCode）
请求进行身份认证使用的函数接口为 ReqAuthenticate（请求身份认证）
和 OnRspAuthenticate（服务端返回的身份认证的响应）。
*/
int TradeChannel::CtpTrdReqUserLogin()
{
	CThostFtdcReqUserLoginField req;
	memset(&req, 0, sizeof(req));
	strcpy(req.BrokerID, STFTDC.BROKER_ID);
	strcpy(req.UserID, STFTDC.INVESTOR_ID);
	strcpy(req.Password, STFTDC.PASSWORD);
	if (STFTDC.AUTHCODE[0] != '\0')
	{
		CThostFtdcReqAuthenticateField authReq;
		memset(&authReq, 0, sizeof(authReq));
		strcpy(authReq.BrokerID, STFTDC.BROKER_ID);
		strcpy(authReq.UserID, STFTDC.INVESTOR_ID);
		strcpy(authReq.AuthCode, STFTDC.AUTHCODE);
		if (iResult = TRDAPI->ReqAuthenticate(&authReq, ++iRequestID) != 0)
			return iResult;
	}
	iResult = TRDAPI->ReqUserLogin(&req, ++iRequestID);
	cerr << "--->>> 发送用户登录请求: " << ((iResult == 0) ? "成功" : "失败") << endl;
	return iResult;
}

void TradeChannel::OnRspUserLogin(CThostFtdcRspUserLoginField *pRspUserLogin,
	CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast)
{
	cerr << "--->>> " << "OnRspUserLogin" << endl;
	if (bIsLast && !IsErrorRspInfo(pRspInfo))
	{
		// 保存会话参数
		STFTDC.FRONT_ID = pRspUserLogin->FrontID;
		STFTDC.SESSION_ID = pRspUserLogin->SessionID;
		int iNextOrderRef = atoi(pRspUserLogin->MaxOrderRef);
		iNextOrderRef++;
		sprintf(STFTDC.ORDER_REF, "%d", iNextOrderRef);
		///获取当前交易日
		cerr << "--->>> 获取当前交易日 = " << TRDAPI->GetTradingDay() << endl;
		///投资者结算结果确认
		CtpTrdReqSettlementInfoConfirm();
	}
}

void TradeChannel::CtpTrdReqSettlementInfoConfirm()
{
	CThostFtdcSettlementInfoConfirmField req;
	memset(&req, 0, sizeof(req));
	strcpy(req.BrokerID, STFTDC.BROKER_ID);
	strcpy(req.InvestorID, STFTDC.INVESTOR_ID);
	int iResult = TRDAPI->ReqSettlementInfoConfirm(&req, ++iRequestID);
	cerr << "--->>> 投资者结算结果确认: " << ((iResult == 0) ? "成功" : "失败") << endl;
}

void TradeChannel::OnRspSettlementInfoConfirm(CThostFtdcSettlementInfoConfirmField *pSettlementInfoConfirm, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast)
{
	cerr << "--->>> " << "OnRspSettlementInfoConfirm" << endl;
	if (bIsLast && !IsErrorRspInfo(pRspInfo))
	{
		///请求查询合约
		CtpTrdReqQryInstrument();
	}
}

void TradeChannel::CtpTrdReqQryInstrument()
{
	CThostFtdcQryInstrumentField req;
	memset(&req, 0, sizeof(req));
	strcpy(req.InstrumentID, STFTDC.INSTRUMENT_ID);
	int iResult = TRDAPI->ReqQryInstrument(&req, ++iRequestID);
	cerr << "--->>> 请求查询合约: " << ((iResult == 0) ? "成功" : "失败") << endl;
}

void TradeChannel::OnRspQryInstrument(CThostFtdcInstrumentField *pInstrument, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast)
{
	cerr << "--->>> " << "OnRspQryInstrument" << endl;
	if (bIsLast && !IsErrorRspInfo(pRspInfo))
	{
		///请求查询合约
		CtpTrdReqQryTradingAccount();
	}
}

void TradeChannel::CtpTrdReqQryTradingAccount()
{
	CThostFtdcQryTradingAccountField req;
	memset(&req, 0, sizeof(req));
	strcpy(req.BrokerID, STFTDC.BROKER_ID);
	strcpy(req.InvestorID, STFTDC.INVESTOR_ID);
	int iResult = TRDAPI->ReqQryTradingAccount(&req, ++iRequestID);
	cerr << "--->>> 请求查询资金账户: " << ((iResult == 0) ? "成功" : "失败") << endl;
}

void TradeChannel::OnRspQryTradingAccount(CThostFtdcTradingAccountField *pTradingAccount, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast)
{
	cerr << "--->>> " << "OnRspQryTradingAccount" << endl;
	if (bIsLast && !IsErrorRspInfo(pRspInfo))
	{
		///请求查询投资者持仓
		CtpTrdReqQryInvestorPosition();
	}
}

void TradeChannel::CtpTrdReqQryInvestorPosition()
{
	CThostFtdcQryInvestorPositionField req;
	memset(&req, 0, sizeof(req));
	strcpy(req.BrokerID, STFTDC.BROKER_ID);
	strcpy(req.InvestorID, STFTDC.INVESTOR_ID);
	strcpy(req.InstrumentID, STFTDC.INSTRUMENT_ID);
	int iResult = TRDAPI->ReqQryInvestorPosition(&req, ++iRequestID);
	cerr << "--->>> 请求查询投资者持仓: " << ((iResult == 0) ? "成功" : "失败") << endl;
}

void TradeChannel::OnRspQryInvestorPosition(CThostFtdcInvestorPositionField *pInvestorPosition, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast)
{
	cerr << "--->>> " << "OnRspQryInvestorPosition" << endl;
	if (bIsLast && !IsErrorRspInfo(pRspInfo))
	{
		///报单录入请求
		CtpTrdReqOrderInsert();
	}
}

void TradeChannel::CtpTrdReqOrderInsert()
{
	CThostFtdcInputOrderField req;
	memset(&req, 0, sizeof(req));
	///经纪公司代码
	strcpy(req.BrokerID, STFTDC.BROKER_ID);
	///投资者代码
	strcpy(req.InvestorID, STFTDC.INVESTOR_ID);
	///合约代码
	strcpy(req.InstrumentID, STFTDC.INSTRUMENT_ID);
	///报单引用
	strcpy(req.OrderRef, STFTDC.ORDER_REF);
	///用户代码
	//	TThostFtdcUserIDType	UserID;
	///报单价格条件: 限价
	req.OrderPriceType = THOST_FTDC_OPT_LimitPrice;
	///买卖方向: 
	req.Direction = STFTDC.DIRECTION;
	///组合开平标志: 开仓
	req.CombOffsetFlag[0] = THOST_FTDC_OF_Open;
	///组合投机套保标志
	req.CombHedgeFlag[0] = THOST_FTDC_HF_Speculation;
	///价格
	req.LimitPrice = STFTDC.LIMIT_PRICE;
	///数量: 1
	req.VolumeTotalOriginal = 1;
	///有效期类型: 当日有效
	req.TimeCondition = THOST_FTDC_TC_GFD;
	///GTD日期
	//	TThostFtdcDateType	GTDDate;
	///成交量类型: 任何数量
	req.VolumeCondition = THOST_FTDC_VC_AV;
	///最小成交量: 1
	req.MinVolume = 1;
	///触发条件: 立即
	req.ContingentCondition = THOST_FTDC_CC_Immediately;
	///止损价
	//	TThostFtdcPriceType	StopPrice;
	///强平原因: 非强平
	req.ForceCloseReason = THOST_FTDC_FCC_NotForceClose;
	///自动挂起标志: 否
	req.IsAutoSuspend = 0;
	///业务单元
	//	TThostFtdcBusinessUnitType	BusinessUnit;
	///请求编号
	//	TThostFtdcRequestIDType	RequestID;
	///用户强评标志: 否
	req.UserForceClose = 0;

	lOrderTime = time(NULL);
	int iResult = TRDAPI->ReqOrderInsert(&req, ++iRequestID);
	cerr << "--->>> 报单录入请求: " << ((iResult == 0) ? "成功" : "失败") << endl;
}

void TradeChannel::OnRspOrderInsert(CThostFtdcInputOrderField *pInputOrder, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast)
{
	cerr << "--->>> " << "OnRspOrderInsert" << endl;
	IsErrorRspInfo(pRspInfo);
}

void TradeChannel::CtpTrdReqOrderAction(CThostFtdcOrderField *pOrder)
{
	static bool ORDER_ACTION_SENT = false;		//是否发送了报单
	if (ORDER_ACTION_SENT)
		return;

	CThostFtdcInputOrderActionField req;
	memset(&req, 0, sizeof(req));
	///经纪公司代码
	strcpy(req.BrokerID, pOrder->BrokerID);
	///投资者代码
	strcpy(req.InvestorID, pOrder->InvestorID);
	///报单操作引用
	//	TThostFtdcOrderActionRefType	OrderActionRef;
	///报单引用
	strcpy(req.OrderRef, pOrder->OrderRef);
	///请求编号
	//	TThostFtdcRequestIDType	RequestID;
	///前置编号
	req.FrontID = STFTDC.FRONT_ID;
	///会话编号
	req.SessionID = STFTDC.SESSION_ID;
	///交易所代码
	//	TThostFtdcExchangeIDType	ExchangeID;
	///报单编号
	//	TThostFtdcOrderSysIDType	OrderSysID;
	///操作标志
	req.ActionFlag = THOST_FTDC_AF_Delete;
	///价格
	//	TThostFtdcPriceType	LimitPrice;
	///数量变化
	//	TThostFtdcVolumeType	VolumeChange;
	///用户代码
	//	TThostFtdcUserIDType	UserID;
	///合约代码
	strcpy(req.InstrumentID, pOrder->InstrumentID);
	lOrderTime = time(NULL);
	int iResult = TRDAPI->ReqOrderAction(&req, ++iRequestID);
	cerr << "--->>> 报单操作请求: " << ((iResult == 0) ? "成功" : "失败") << endl;
	ORDER_ACTION_SENT = true;
}

void TradeChannel::OnRspOrderAction(CThostFtdcInputOrderActionField *pInputOrderAction, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast)
{
	cerr << "--->>> " << "OnRspOrderAction" << endl;
	IsErrorRspInfo(pRspInfo);
}

///报单通知
void TradeChannel::OnRtnOrder(CThostFtdcOrderField *pOrder)
{
	cerr << "--->>> " << "OnRtnOrder" << endl;
	lOrderOkTime = time(NULL);
	time_t lTime = lOrderOkTime - lOrderTime;
	cerr << "--->>> 报单到报单通知的时间差 = " << lTime << endl;
	if (IsMyOrder(pOrder))
	{
		if (IsTradingOrder(pOrder))
		{
			//ReqOrderAction(pOrder);
		}
		else if (pOrder->OrderStatus == THOST_FTDC_OST_Canceled)
			cout << "--->>> 撤单成功" << endl;
	}
}

///成交通知
void TradeChannel::OnRtnTrade(CThostFtdcTradeField *pTrade)
{
	cerr << "--->>> " << "OnRtnTrade" << endl;
}

void TradeChannel::OnFrontDisconnected(int nReason)
{
	cerr << "--->>> " << "OnFrontDisconnected" << endl;
	cerr << "--->>> Reason = " << nReason << endl;
}

void TradeChannel::OnHeartBeatWarning(int nTimeLapse)
{
	cerr << "--->>> " << "OnHeartBeatWarning" << endl;
	cerr << "--->>> nTimerLapse = " << nTimeLapse << endl;
}

void TradeChannel::OnRspError(CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast)
{
	cerr << "--->>> " << "OnRspError" << endl;
	IsErrorRspInfo(pRspInfo);
}

bool TradeChannel::IsMyOrder(CThostFtdcOrderField *pOrder)
{
	return ((pOrder->FrontID == STFTDC.FRONT_ID) &&
		(pOrder->SessionID == STFTDC.SESSION_ID) &&
		(strcmp(pOrder->OrderRef, STFTDC.ORDER_REF) == 0));
}

bool TradeChannel::IsTradingOrder(CThostFtdcOrderField *pOrder)
{
	return ((pOrder->OrderStatus != THOST_FTDC_OST_PartTradedNotQueueing) &&
		(pOrder->OrderStatus != THOST_FTDC_OST_Canceled) &&
		(pOrder->OrderStatus != THOST_FTDC_OST_AllTraded));
}
