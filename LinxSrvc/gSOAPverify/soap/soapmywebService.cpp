/* soapmywebService.cpp
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

#include "soapmywebService.h"

mywebService::mywebService() : soap(SOAP_IO_DEFAULT)
{	mywebService_init(SOAP_IO_DEFAULT, SOAP_IO_DEFAULT);
}

mywebService::mywebService(const mywebService& rhs)
{	soap_copy_context(this, &rhs);
}

mywebService::mywebService(const struct soap &_soap) : soap(_soap)
{ }

mywebService::mywebService(soap_mode iomode) : soap(iomode)
{	mywebService_init(iomode, iomode);
}

mywebService::mywebService(soap_mode imode, soap_mode omode) : soap(imode, omode)
{	mywebService_init(imode, omode);
}

mywebService::~mywebService()
{
	this->destroy();
}

void mywebService::mywebService_init(soap_mode imode, soap_mode omode)
{	soap_imode(this, imode);
	soap_omode(this, omode);
	static const struct Namespace namespaces[] = {
        { "SOAP-ENV", "http://schemas.xmlsoap.org/soap/envelope/", "http://www.w3.org/*/soap-envelope", NULL },
        { "SOAP-ENC", "http://schemas.xmlsoap.org/soap/encoding/", "http://www.w3.org/*/soap-encoding", NULL },
        { "xsi", "http://www.w3.org/2001/XMLSchema-instance", "http://www.w3.org/*/XMLSchema-instance", NULL },
        { "xsd", "http://www.w3.org/2001/XMLSchema", "http://www.w3.org/*/XMLSchema", NULL },
        { "api", "urn:myweb", NULL, NULL },
        { NULL, NULL, NULL, NULL}
    };
	soap_set_namespaces(this, namespaces);
}

void mywebService::destroy()
{	soap_destroy(this);
	soap_end(this);
}

void mywebService::reset()
{	this->destroy();
	soap_done(this);
	soap_initialize(this);
	mywebService_init(SOAP_IO_DEFAULT, SOAP_IO_DEFAULT);
}

#ifndef WITH_PURE_VIRTUAL
mywebService *mywebService::copy()
{	mywebService *dup = SOAP_NEW_UNMANAGED(mywebService(*(struct soap*)this));
	return dup;
}
#endif

mywebService& mywebService::operator=(const mywebService& rhs)
{	soap_done(this);
	soap_copy_context(this, &rhs);
	return *this;
}

int mywebService::soap_close_socket()
{	return soap_closesock(this);
}

int mywebService::soap_force_close_socket()
{	return soap_force_closesock(this);
}

int mywebService::soap_senderfault(const char *string, const char *detailXML)
{	return ::soap_sender_fault(this, string, detailXML);
}

int mywebService::soap_senderfault(const char *subcodeQName, const char *string, const char *detailXML)
{	return ::soap_sender_fault_subcode(this, subcodeQName, string, detailXML);
}

int mywebService::soap_receiverfault(const char *string, const char *detailXML)
{	return ::soap_receiver_fault(this, string, detailXML);
}

int mywebService::soap_receiverfault(const char *subcodeQName, const char *string, const char *detailXML)
{	return ::soap_receiver_fault_subcode(this, subcodeQName, string, detailXML);
}

void mywebService::soap_print_fault(FILE *fd)
{	::soap_print_fault(this, fd);
}

#ifndef WITH_LEAN
#ifndef WITH_COMPAT
void mywebService::soap_stream_fault(std::ostream& os)
{	::soap_stream_fault(this, os);
}
#endif

char *mywebService::soap_sprint_fault(char *buf, size_t len)
{	return ::soap_sprint_fault(this, buf, len);
}
#endif

void mywebService::soap_noheader()
{	this->header = NULL;
}

::SOAP_ENV__Header *mywebService::soap_header()
{	return this->header;
}

#ifndef WITH_NOIO
int mywebService::run(int port, int backlog)
{	if (!soap_valid_socket(this->master) && !soap_valid_socket(this->bind(NULL, port, backlog)))
		return this->error;
	for (;;)
	{	if (!soap_valid_socket(this->accept()))
		{	if (this->errnum == 0) // timeout?
				this->error = SOAP_OK;
			break;
		}
		if (this->serve())
			break;
		this->destroy();
	}
	return this->error;
}

#if defined(WITH_OPENSSL) || defined(WITH_GNUTLS)
int mywebService::ssl_run(int port, int backlog)
{	if (!soap_valid_socket(this->master) && !soap_valid_socket(this->bind(NULL, port, backlog)))
		return this->error;
	for (;;)
	{	if (!soap_valid_socket(this->accept()))
		{	if (this->errnum == 0) // timeout?
				this->error = SOAP_OK;
			break;
		}
		if (this->ssl_accept() || this->serve())
			break;
		this->destroy();
	}
	return this->error;
}
#endif

SOAP_SOCKET mywebService::bind(const char *host, int port, int backlog)
{	return soap_bind(this, host, port, backlog);
}

SOAP_SOCKET mywebService::accept()
{	return soap_accept(this);
}

#if defined(WITH_OPENSSL) || defined(WITH_GNUTLS)
int mywebService::ssl_accept()
{	return soap_ssl_accept(this);
}
#endif
#endif

int mywebService::serve()
{
#ifndef WITH_FASTCGI
	this->keep_alive = this->max_keep_alive + 1;
#endif
	do
	{
#ifndef WITH_FASTCGI
		if (this->keep_alive > 0 && this->max_keep_alive > 0)
			this->keep_alive--;
#endif
		if (soap_begin_serve(this))
		{	if (this->error >= SOAP_STOP)
				continue;
			return this->error;
		}
		if ((dispatch() || (this->fserveloop && this->fserveloop(this))) && this->error && this->error < SOAP_STOP)
		{
#ifdef WITH_FASTCGI
			soap_send_fault(this);
#else
			return soap_send_fault(this);
#endif
		}
#ifdef WITH_FASTCGI
		soap_destroy(this);
		soap_end(this);
	} while (1);
#else
	} while (this->keep_alive);
#endif
	return SOAP_OK;
}

static int serve_api__trans(mywebService*);
static int serve_api__get_server_status(mywebService*);
static int serve_api__login_by_key(mywebService*);

int mywebService::dispatch()
{
	(void)soap_peek_element(this);
	if (!soap_match_tag(this, this->tag, "api:trans"))
		return serve_api__trans(this);
	if (!soap_match_tag(this, this->tag, "api:get-server-status"))
		return serve_api__get_server_status(this);
	if (!soap_match_tag(this, this->tag, "api:login-by-key"))
		return serve_api__login_by_key(this);
	return this->error = SOAP_NO_METHOD;
}

static int serve_api__trans(mywebService *soap)
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
	soap->error = soap->trans(soap_tmp_api__trans.msg, soap_tmp_api__transResponse.rtn);
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

static int serve_api__get_server_status(mywebService *soap)
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
	soap->error = soap->get_server_status(soap_tmp_api__get_server_status.req, soap_tmp_api__get_server_statusResponse.rsp);
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

static int serve_api__login_by_key(mywebService *soap)
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
	soap->error = soap->login_by_key(soap_tmp_api__login_by_key.usr, soap_tmp_api__login_by_key.psw, stat);
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
/* End of server object code */
