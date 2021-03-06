#pragma once
#include "IM/IMClient.h"

// IMlogDlg 对话框

class IMlogDlg : public CDialogEx
{
    DECLARE_DYNAMIC(IMlogDlg)

public:
    IMlogDlg(CWnd* pParent = NULL);   // 标准构造函数
    IMlogDlg(int(*func)(char*, char*));
    virtual ~IMlogDlg();

    // 对话框数据
#ifdef AFX_DESIGN_TIME
    enum { IDD = IDD_IMMODAL };
#endif

protected:
    virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV 支持

    DECLARE_MESSAGE_MAP()
protected:
    virtual void PostNcDestroy();
    virtual BOOL OnInitDialog();
public:
    afx_msg void OnBnClickedCancel();
    afx_msg void OnBnClickedOk();
    virtual BOOL Create(UINT Tmp, CWnd* Wnd);
    int getVisable();
    void setVisable(int visable);
    char* getUsername();
private:
    CString m_strAcnt, m_strPsw;
    CEdit m_editUsr, m_editPsw;
    int(*setUsrPsw)(char*, char*);
    int visable = 0;
};
