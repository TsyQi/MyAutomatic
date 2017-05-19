#pragma once
#include	<iostream>
#include	<cstring>
#include	<ctime>
#include "ThostFtdcMdApi.h"
#include "ThostFtdcTraderApi.h"

using namespace std;

typedef char TThostFtdcFrontAddrType[64];

struct st_TThostFtdc {
	const char* FLOW_PATH = "./"/*"*.con"*/;
	bool ISMULTICAST = false;
	CThostFtdcTraderApi *TRDAPI;
	CThostFtdcMdApi *MDAPI;
	TThostFtdcFrontAddrType FRONT_ADDR = "tcp://180.168.146.187:10000";		// 前置地址
	TThostFtdcBrokerIDType	BROKER_ID = "9999";				// 经纪公司代码
	TThostFtdcInvestorIDType INVESTOR_ID = "";			// 注意输入你自己的simnow仿真投资者（用户）代码
	TThostFtdcUserIDType USER_ID;
	TThostFtdcPasswordType  PASSWORD = "";			// 注意输入你自己的simnow仿真用户密码
	TThostFtdcInstrumentIDType INSTRUMENT_ID = "rb1701";	// 合约代码 ，注意与时俱进改变合约ID,避免使用过时合约
	TThostFtdcDirectionType	DIRECTION = THOST_FTDC_D_Sell;	// 买卖方向
	TThostFtdcPriceType	LIMIT_PRICE = 2380;				// 价格
	TThostFtdcFrontIDType	FRONT_ID;	//前置编号
	TThostFtdcSessionIDType	SESSION_ID;	//会话编号
	TThostFtdcOrderRefType	ORDER_REF;	//报单引用
	TThostFtdcAuthCodeType AUTHCODE;
};

class MarketDataCollector :
	public CThostFtdcMdSpi
{
public:
	MarketDataCollector() {};
	MarketDataCollector(CThostFtdcMdApi* api);
	virtual ~MarketDataCollector();
private:
	CThostFtdcMdApi *MdApi;
	int iRequestID = 0;
	int iResult = -1;
public:
	// 行情接口
	int CtpMarketMainApi();
private:
	int CtpMarketReqUserLogin();
	int CtpMarketSubscribe(char* arrayOfConracts[], int sizeOfArray);
	int CtpMarketUnSubscribe(char *arrayOfConracts[], int sizeOfArray);
	int CtpMarketLogout(CThostFtdcUserLogoutField *req, int requestId);
};

class TradeChannel :
	CThostFtdcTraderSpi
{
public:
	TradeChannel() {};
	TradeChannel(CThostFtdcTraderApi* api);
	virtual ~TradeChannel();
private:
	int iRequestID = 0;
	int iResult = -1;
	time_t lOrderTime;
	time_t lOrderOkTime;
public:
	// 交易接口
	int CtpTradeMainApi();
	int getRtn();
public:
	virtual void OnFrontConnected() override;
	virtual void OnRspUserLogin(CThostFtdcRspUserLoginField * pRspUserLogin, CThostFtdcRspInfoField * pRspInfo, int nRequestID, bool bIsLast) override;
	virtual void OnRspSettlementInfoConfirm(CThostFtdcSettlementInfoConfirmField *pSettlementInfoConfirm, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast) override; 
	virtual void OnRspQryInstrument(CThostFtdcInstrumentField *pInstrument, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast) override;
	virtual void OnRspQryTradingAccount(CThostFtdcTradingAccountField *pTradingAccount, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast) override;
	virtual void OnRspQryInvestorPosition(CThostFtdcInvestorPositionField *pInvestorPosition, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast) override;
	virtual void OnRspOrderInsert(CThostFtdcInputOrderField *pInputOrder, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast) override;
	virtual void OnRspOrderAction(CThostFtdcInputOrderActionField *pInputOrderAction, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast) override;
	virtual void OnRspError(CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast) override;
	virtual void OnRtnOrder(CThostFtdcOrderField *pOrder) override;
	virtual void OnRtnTrade(CThostFtdcTradeField *pTrade) override;
	virtual void OnHeartBeatWarning(int nTimeLapse) override;
	virtual void OnFrontDisconnected(int nReason) override;
private:
	///用户登陆请求
	int CtpTrdReqUserLogin();
	///投资者结算结果确认
	void CtpTrdReqSettlementInfoConfirm();
	///请求查询合约
	void CtpTrdReqQryInstrument();
	///请求查询资金账户
	void CtpTrdReqQryTradingAccount();
	///请求查询投资者持仓
	void CtpTrdReqQryInvestorPosition();
	///报单录入请求
	void CtpTrdReqOrderInsert();
	///报单操作请求
	void CtpTrdReqOrderAction(CThostFtdcOrderField *pOrder);
	//是否收到成功响应
	bool IsErrorRspInfo(CThostFtdcRspInfoField *pRspInfo);
	//是否我的报单回报
	bool IsMyOrder(CThostFtdcOrderField *pOrder);
	//是否当前交易报单
	bool IsTradingOrder(CThostFtdcOrderField *pOrder);
};
