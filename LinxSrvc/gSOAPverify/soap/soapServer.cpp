/* soapServer.cpp
   Generated by gSOAP 2.8.106 for rpcapi.h

gSOAP XML Web services tools
Copyright (C) 2000-2020, Robert van Engelen, Genivia Inc. All Rights Reserved.
The soapcpp2 tool and its generated software are released under the GPL.
This program is released under the GPL with the additional exemption that
compiling, linking, and/or using OpenSSL is allowed.
--------------------------------------------------------------------------------
A commercial use license is available from Genivia Inc., contact@genivia.com
--------------------------------------------------------------------------------
*/

#if defined(__BORLANDC__)
#pragma option push -w-8060
#pragma option push -w-8004
#endif
#include "soapH.h"

SOAP_SOURCE_STAMP("@(#) soapServer.cpp ver 2.8.106 2020-09-06 16:26:59 GMT")
extern "C" SOAP_FMAC5 int SOAP_FMAC6 soap_serve(struct soap *soap)
{
#ifndef WITH_FASTCGI
	soap->keep_alive = soap->max_keep_alive + 1;
#endif
	do
	{
#ifndef WITH_FASTCGI
		if (soap->keep_alive > 0 && soap->max_keep_alive > 0)
			soap->keep_alive--;
#endif
		if (soap_begin_serve(soap))
		{	if (soap->error >= SOAP_STOP)
				continue;
			return soap->error;
		}
		if ((soap_serve_request(soap) || (soap->fserveloop && soap->fserveloop(soap))) && soap->error && soap->error < SOAP_STOP)
		{
#ifdef WITH_FASTCGI
			soap_send_fault(soap);
#else
			return soap_send_fault(soap);
#endif
		}
#ifdef WITH_FASTCGI
		soap_destroy(soap);
		soap_end(soap);
	} while (1);
#else
	} while (soap->keep_alive);
#endif
	return SOAP_OK;
}

#ifndef WITH_NOSERVEREQUEST
extern "C" SOAP_FMAC5 int SOAP_FMAC6 soap_serve_request(struct soap *soap)
{
	(void)soap_peek_element(soap);
	if (!soap_match_tag(soap, soap->tag, "api:trans"))
		return soap_serve_api__trans(soap);
	if (!soap_match_tag(soap, soap->tag, "api:get-server-status"))
		return soap_serve_api__get_server_status(soap);
	if (!soap_match_tag(soap, soap->tag, "api:login-by-key"))
		return soap_serve_api__login_by_key(soap);
	return soap->error = SOAP_NO_METHOD;
}
#endif

SOAP_FMAC5 int SOAP_FMAC6 soap_serve_api__trans(struct soap *soap)
{	struct api__trans soap_tmp_api__trans;
	struct api__transResponse soap_tmp_api__transResponse;
	char * soap_tmp_xsd_string;
	soap_default_api__transResponse(soap, &soap_tmp_api__transResponse);
	soap_tmp_xsd_string = NULL;
	soap_tmp_api__transResponse.rtn = &soap_tmp_xsd_string;
	soap_default_api__trans(soap, &soap_tmp_api__trans);
	if (!soap_get_api__trans(soap, &soap_tmp_api__trans, "api:trans", NULL))
		return soap->error;
	if (soap_body_end_in(soap)
	 || soap_envelope_end_in(soap)
	 || soap_end_recv(soap))
		return soap->error;
	soap->error = api__trans(soap, soap_tmp_api__trans.msg, soap_tmp_api__transResponse.rtn);
	if (soap->error)
		return soap->error;
	soap->encodingStyle = ""; /* use SOAP encoding style */
	soap_serializeheader(soap);
	soap_serialize_api__transResponse(soap, &soap_tmp_api__transResponse);
	if (soap_begin_count(soap))
		return soap->error;
	if ((soap->mode & SOAP_IO_LENGTH))
	{	if (soap_envelope_begin_out(soap)
		 || soap_putheader(soap)
		 || soap_body_begin_out(soap)
		 || soap_put_api__transResponse(soap, &soap_tmp_api__transResponse, "api:transResponse", "")
		 || soap_body_end_out(soap)
		 || soap_envelope_end_out(soap))
			 return soap->error;
	};
	if (soap_end_count(soap)
	 || soap_response(soap, SOAP_OK)
	 || soap_envelope_begin_out(soap)
	 || soap_putheader(soap)
	 || soap_body_begin_out(soap)
	 || soap_put_api__transResponse(soap, &soap_tmp_api__transResponse, "api:transResponse", "")
	 || soap_body_end_out(soap)
	 || soap_envelope_end_out(soap)
	 || soap_end_send(soap))
		return soap->error;
	return soap_closesock(soap);
}

SOAP_FMAC5 int SOAP_FMAC6 soap_serve_api__get_server_status(struct soap *soap)
{	struct api__get_server_status soap_tmp_api__get_server_status;
	struct api__get_server_statusResponse soap_tmp_api__get_server_statusResponse;
	soap_default_api__get_server_statusResponse(soap, &soap_tmp_api__get_server_statusResponse);
	soap_default_api__get_server_status(soap, &soap_tmp_api__get_server_status);
	if (!soap_get_api__get_server_status(soap, &soap_tmp_api__get_server_status, "api:get-server-status", NULL))
		return soap->error;
	if (soap_body_end_in(soap)
	 || soap_envelope_end_in(soap)
	 || soap_end_recv(soap))
		return soap->error;
	soap->error = api__get_server_status(soap, soap_tmp_api__get_server_status.req, soap_tmp_api__get_server_statusResponse.rsp);
	if (soap->error)
		return soap->error;
	soap->encodingStyle = ""; /* use SOAP encoding style */
	soap_serializeheader(soap);
	soap_serialize_api__get_server_statusResponse(soap, &soap_tmp_api__get_server_statusResponse);
	if (soap_begin_count(soap))
		return soap->error;
	if ((soap->mode & SOAP_IO_LENGTH))
	{	if (soap_envelope_begin_out(soap)
		 || soap_putheader(soap)
		 || soap_body_begin_out(soap)
		 || soap_put_api__get_server_statusResponse(soap, &soap_tmp_api__get_server_statusResponse, "api:get-server-statusResponse", "")
		 || soap_body_end_out(soap)
		 || soap_envelope_end_out(soap))
			 return soap->error;
	};
	if (soap_end_count(soap)
	 || soap_response(soap, SOAP_OK)
	 || soap_envelope_begin_out(soap)
	 || soap_putheader(soap)
	 || soap_body_begin_out(soap)
	 || soap_put_api__get_server_statusResponse(soap, &soap_tmp_api__get_server_statusResponse, "api:get-server-statusResponse", "")
	 || soap_body_end_out(soap)
	 || soap_envelope_end_out(soap)
	 || soap_end_send(soap))
		return soap->error;
	return soap_closesock(soap);
}

SOAP_FMAC5 int SOAP_FMAC6 soap_serve_api__login_by_key(struct soap *soap)
{	struct api__login_by_key soap_tmp_api__login_by_key;
	struct api__ArrayOfEmp2 stat;
	soap_default_api__ArrayOfEmp2(soap, &stat);
	soap_default_api__login_by_key(soap, &soap_tmp_api__login_by_key);
	if (!soap_get_api__login_by_key(soap, &soap_tmp_api__login_by_key, "api:login-by-key", NULL))
		return soap->error;
	if (soap_body_end_in(soap)
	 || soap_envelope_end_in(soap)
	 || soap_end_recv(soap))
		return soap->error;
	soap->error = api__login_by_key(soap, soap_tmp_api__login_by_key.usr, soap_tmp_api__login_by_key.psw, stat);
	if (soap->error)
		return soap->error;
	soap->encodingStyle = ""; /* use SOAP encoding style */
	soap_serializeheader(soap);
	soap_serialize_api__ArrayOfEmp2(soap, &stat);
	if (soap_begin_count(soap))
		return soap->error;
	if ((soap->mode & SOAP_IO_LENGTH))
	{	if (soap_envelope_begin_out(soap)
		 || soap_putheader(soap)
		 || soap_body_begin_out(soap)
		 || soap_put_api__ArrayOfEmp2(soap, &stat, "api:ArrayOfEmp2", "")
		 || soap_body_end_out(soap)
		 || soap_envelope_end_out(soap))
			 return soap->error;
	};
	if (soap_end_count(soap)
	 || soap_response(soap, SOAP_OK)
	 || soap_envelope_begin_out(soap)
	 || soap_putheader(soap)
	 || soap_body_begin_out(soap)
	 || soap_put_api__ArrayOfEmp2(soap, &stat, "api:ArrayOfEmp2", "")
	 || soap_body_end_out(soap)
	 || soap_envelope_end_out(soap)
	 || soap_end_send(soap))
		return soap->error;
	return soap_closesock(soap);
}

#if defined(__BORLANDC__)
#pragma option pop
#pragma option pop
#endif

/* End of soapServer.cpp */
