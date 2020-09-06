// Reminder: Modify typemap.dat to customize the header file generated by wsdl2h
/* myweb.h
   Generated by wsdl2h 2.8.106 from myweb.wsdl and typemap.dat
   2020-09-06 16:27:00 GMT

   DO NOT INCLUDE THIS ANNOTATED FILE DIRECTLY IN YOUR PROJECT SOURCE CODE.
   USE THE FILES GENERATED BY soapcpp2 FOR YOUR PROJECT'S SOURCE CODE.

gSOAP XML Web services tools
Copyright (C) 2000-2020, Robert van Engelen, Genivia Inc. All Rights Reserved.
This program is released under the GPL with the additional exemption that
compiling, linking, and/or using OpenSSL is allowed.
--------------------------------------------------------------------------------
A commercial use license is available from Genivia Inc., contact@genivia.com
--------------------------------------------------------------------------------
*/

/**

@page page_notes Notes

@note HINTS:
 - Run soapcpp2 on myweb.h to generate the SOAP/XML processing logic:
   Use soapcpp2 -I to specify paths for #import
   Use soapcpp2 -j to generate improved proxy and server classes.
   Use soapcpp2 -r to generate a report.
 - Edit 'typemap.dat' to control namespace bindings and type mappings:
   It is strongly recommended to customize the names of the namespace prefixes
   generated by wsdl2h. To do so, modify the prefix bindings in the Namespaces
   section below and add the modified lines to 'typemap.dat' to rerun wsdl2h.
 - Run Doxygen (www.doxygen.org) on this file to generate documentation.
 - Use wsdl2h -c to generate pure C code.
 - Use wsdl2h -R to include the REST operations defined by the WSDLs.
 - Use wsdl2h -O3 or -O4 to optimize by removing unused schema components.
 - Use wsdl2h -d to enable DOM support for xsd:any and xsd:anyType.
 - Use wsdl2h -F to simulate struct-type derivation in C (also works in C++).
 - Use wsdl2h -f to generate flat C++ class hierarchy, removes type derivation.
 - Use wsdl2h -g to generate top-level root elements with readers and writers.
 - Use wsdl2h -U to map XML names to C++ Unicode identifiers instead of _xNNNN.
 - Use wsdl2h -u to disable the generation of unions.
 - Use wsdl2h -L to remove this @note and all other @note comments.
 - Use wsdl2h -nname to use name as the base namespace prefix instead of 'ns'.
 - Use wsdl2h -Nname for service prefix and produce multiple service bindings
 - Struct/class members serialized as XML attributes are annotated with a '@'.
 - Struct/class members that have a special role are annotated with a '$'.

@warning
   DO NOT INCLUDE THIS ANNOTATED FILE DIRECTLY IN YOUR PROJECT SOURCE CODE.
   USE THE FILES GENERATED BY soapcpp2 FOR YOUR PROJECT'S SOURCE CODE:
   THE GENERATED soapStub.h FILE CONTAINS THIS CONTENT WITHOUT ANNOTATIONS.

@copyright LICENSE:
@verbatim
--------------------------------------------------------------------------------
gSOAP XML Web services tools
Copyright (C) 2000-2020, Robert van Engelen, Genivia Inc. All Rights Reserved.
The wsdl2h tool and its generated software are released under the GPL.
This software is released under the GPL with the additional exemption that
compiling, linking, and/or using OpenSSL is allowed.
--------------------------------------------------------------------------------
GPL license.

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 59 Temple
Place, Suite 330, Boston, MA 02111-1307 USA

Author contact information:
engelen@genivia.com / engelen@acm.org

This program is released under the GPL with the additional exemption that
compiling, linking, and/or using OpenSSL is allowed.
--------------------------------------------------------------------------------
A commercial-use license is available from Genivia, Inc., contact@genivia.com
--------------------------------------------------------------------------------
@endverbatim

*/


//gsoapopt c++,w

/******************************************************************************\
 *                                                                            *
 * Definitions                                                                *
 *   http://localhost/myweb.wsdl                                              *
 *                                                                            *
\******************************************************************************/


/******************************************************************************\
 *                                                                            *
 * $CONTAINER typemap variable:                                               *
 *   std::vector                                                              *
 *                                                                            *
\******************************************************************************/

#include <vector>
template <class T> class std::vector;

/******************************************************************************\
 *                                                                            *
 * $SIZE typemap variable:                                                    *
 *   int                                                                      *
 *                                                                            *
\******************************************************************************/


/******************************************************************************\
 *                                                                            *
 * Import                                                                     *
 *                                                                            *
\******************************************************************************/


/******************************************************************************\
 *                                                                            *
 * Schema Namespaces                                                          *
 *                                                                            *
\******************************************************************************/


/* NOTE:

It is strongly recommended to customize the names of the namespace prefixes
generated by wsdl2h. To do so, modify the prefix bindings below and add the
modified lines to 'typemap.dat' then rerun wsdl2h (use wsdl2h -t typemap.dat):

ns1 = "http://localhost/myweb.wsdl"
ns2 = "urn:myweb"

*/

#define SOAP_NAMESPACE_OF_ns2	"urn:myweb"
//gsoap ns2   schema namespace:	urn:myweb
//gsoap ns2   schema form:	unqualified

/******************************************************************************\
 *                                                                            *
 * Built-in Schema Types and Top-Level Elements and Attributes                *
 *                                                                            *
\******************************************************************************/

/// Primitive built-in type "wsdl:xsd-string".
typedef std::string wsdl__xsd_string;

//gsoap wsdl  schema namespace:	http://www.w3.org/ns/wsdl

/// Primitive built-in type "xs:xsd-int".
typedef std::string xsd__xsd_int;

/// Primitive built-in type "xs:xsd-string".
typedef std::string xsd__xsd_string;


/******************************************************************************\
 *                                                                            *
 * Forward Declarations                                                       *
 *                                                                            *
\******************************************************************************/


class ns2__result;


/******************************************************************************\
 *                                                                            *
 * Schema Types and Top-Level Elements and Attributes                         *
 *   urn:myweb                                                                *
 *                                                                            *
\******************************************************************************/


/******************************************************************************\
 *                                                                            *
 * Schema Complex Types and Top-Level Elements                                *
 *   urn:myweb                                                                *
 *                                                                            *
\******************************************************************************/

/// @brief "urn:myweb":result is a complexType.
///
/// @note class ns2__result operations:
/// - ns2__result* soap_new_ns2__result(soap*) allocate and default initialize
/// - ns2__result* soap_new_ns2__result(soap*, int num) allocate and default initialize an array
/// - ns2__result* soap_new_req_ns2__result(soap*, ...) allocate, set required members
/// - ns2__result* soap_new_set_ns2__result(soap*, ...) allocate, set all public members
/// - ns2__result::soap_default(soap*) default initialize members
/// - int soap_read_ns2__result(soap*, ns2__result*) deserialize from a stream
/// - int soap_write_ns2__result(soap*, ns2__result*) serialize to a stream
/// - ns2__result* ns2__result::soap_dup(soap*) returns deep copy of ns2__result, copies the (cyclic) graph structure when a context is provided, or (cycle-pruned) tree structure with soap_set_mode(soap, SOAP_XML_TREE) (use soapcpp2 -Ec)
/// - ns2__result::soap_del() deep deletes ns2__result data members, use only after ns2__result::soap_dup(NULL) (use soapcpp2 -Ed)
/// - int ns2__result::soap_type() returns SOAP_TYPE_ns2__result or derived type identifier
class ns2__result
{ public:
/// Element "flag" of type xs:xsd-int.
    xsd__xsd_int                         flag                           1;	///< Required element.
/// Element "idx" of type xs:xsd-int.
    xsd__xsd_int                         idx                            1;	///< Required element.
/// Element "age" of type xs:xsd-int.
    xsd__xsd_int                         age                            1;	///< Required element.
/// Element "tell" of type xs:xsd-string.
    xsd__xsd_string*                     tell                           0;	///< Optional element.
/// Element "email" of type xs:xsd-string.
    xsd__xsd_string*                     email                          0;	///< Optional element.
/// Pointer to soap context that manages this instance.
    struct soap                         *soap                          ;
};


/******************************************************************************\
 *                                                                            *
 * Additional Top-Level Elements                                              *
 *   urn:myweb                                                                *
 *                                                                            *
\******************************************************************************/


/******************************************************************************\
 *                                                                            *
 * Additional Top-Level Attributes                                            *
 *   urn:myweb                                                                *
 *                                                                            *
\******************************************************************************/


/******************************************************************************\
 *                                                                            *
 * Services                                                                   *
 *                                                                            *
\******************************************************************************/


//gsoap ns2  service name:	myweb 
//gsoap ns2  service type:	mywebPortType 
//gsoap ns2  service port:	http://localhost/myweb.cgi/myweb.cgi 
//gsoap ns2  service namespace:	urn:myweb 
//gsoap ns2  service transport:	http://schemas.xmlsoap.org/soap/http 

/** @mainpage myweb Definitions

@section myweb_bindings Service Bindings

  - @ref myweb

@section myweb_more More Information

  - @ref page_notes "Notes"

  - @ref page_XMLDataBinding "XML Data Binding"

  - @ref SOAP_ENV__Header "SOAP Header Content" (when applicable)

  - @ref SOAP_ENV__Detail "SOAP Fault Detail Content" (when applicable)


*/

/** @page myweb Binding "myweb"

@section myweb_service Service Documentation "myweb"
gSOAP 2.8.106 generated service definition

@section myweb_operations Operations of Binding "myweb"

  - @ref ns2__trans

  - @ref ns2__get_server_status

  - @ref ns2__login_by_key

@section myweb_ports Default endpoints of Binding "myweb"

  - http://localhost/myweb.cgi/myweb.cgi

@note Use wsdl2h option -Nname to change the service binding prefix name


*/

/******************************************************************************\
 *                                                                            *
 * Service Binding                                                            *
 *   myweb                                                                    *
 *                                                                            *
\******************************************************************************/


/******************************************************************************\
 *                                                                            *
 * Service Operation                                                          *
 *   ns2__trans                                                               *
 *                                                                            *
\******************************************************************************/


/** Operation "ns2__trans" of service binding "myweb".
Service definition of function api__trans

  - SOAP RPC encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"

  - Default endpoints:
    - http://localhost/myweb.cgi/myweb.cgi

  - Addressing input action: ""

  - Addressing output action: "Response"

C stub function (defined in soapClient.c[pp] generated by soapcpp2):
@code
  int soap_call_ns2__trans(
    struct soap *soap,
    NULL, // char *endpoint = NULL selects default endpoint for this operation
    NULL, // char *action = NULL selects default action for this operation
    // input parameters:
    wsdl__xsd_string                    msg,
    // output parameters:
    wsdl__xsd_string                   &rtn
  );
@endcode

C server function (called from the service dispatcher defined in soapServer.c[pp]):
@code
  int ns2__trans(
    struct soap *soap,
    // input parameters:
    wsdl__xsd_string                    msg,
    // output parameters:
    wsdl__xsd_string                   &rtn
  );
@endcode

C++ proxy class (defined in soapmywebProxy.h generated with soapcpp2):
@code
  class mywebProxy;
@endcode
Important: use soapcpp2 option '-j' (or '-i') to generate improved and easy-to-use proxy classes;

C++ service class (defined in soapmywebService.h generated with soapcpp2):
@code
  class mywebService;
@endcode
Important: use soapcpp2 option '-j' (or '-i') to generate improved and easy-to-use service classes;

*/

//gsoap ns2  service method-protocol:	trans SOAP
//gsoap ns2  service method-style:	trans rpc
//gsoap ns2  service method-encoding:	trans http://schemas.xmlsoap.org/soap/encoding/
//gsoap ns2  service method-action:	trans ""
//gsoap ns2  service method-output-action:	trans Response
int ns2__trans(
    wsdl__xsd_string                    :msg,	///< Input parameter, :unqualified name as per RPC encoding
    wsdl__xsd_string                   &:rtn	///< Output parameter, :unqualified name as per RPC encoding
);

/******************************************************************************\
 *                                                                            *
 * Service Operation                                                          *
 *   ns2__get_server_status                                                   *
 *                                                                            *
\******************************************************************************/


/** Operation "ns2__get_server_status" of service binding "myweb".
Service definition of function api__get_server_status

  - SOAP RPC encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"

  - Default endpoints:
    - http://localhost/myweb.cgi/myweb.cgi

  - Addressing input action: ""

  - Addressing output action: "Response"

C stub function (defined in soapClient.c[pp] generated by soapcpp2):
@code
  int soap_call_ns2__get_server_status(
    struct soap *soap,
    NULL, // char *endpoint = NULL selects default endpoint for this operation
    NULL, // char *action = NULL selects default action for this operation
    // input parameters:
    wsdl__xsd_string                    req,
    // output parameters:
    wsdl__xsd_string                   &rsp
  );
@endcode

C server function (called from the service dispatcher defined in soapServer.c[pp]):
@code
  int ns2__get_server_status(
    struct soap *soap,
    // input parameters:
    wsdl__xsd_string                    req,
    // output parameters:
    wsdl__xsd_string                   &rsp
  );
@endcode

C++ proxy class (defined in soapmywebProxy.h generated with soapcpp2):
@code
  class mywebProxy;
@endcode
Important: use soapcpp2 option '-j' (or '-i') to generate improved and easy-to-use proxy classes;

C++ service class (defined in soapmywebService.h generated with soapcpp2):
@code
  class mywebService;
@endcode
Important: use soapcpp2 option '-j' (or '-i') to generate improved and easy-to-use service classes;

*/

//gsoap ns2  service method-protocol:	get_server_status SOAP
//gsoap ns2  service method-style:	get_server_status rpc
//gsoap ns2  service method-encoding:	get_server_status http://schemas.xmlsoap.org/soap/encoding/
//gsoap ns2  service method-action:	get_server_status ""
//gsoap ns2  service method-output-action:	get_server_status Response
int ns2__get_server_status(
    wsdl__xsd_string                    :req,	///< Input parameter, :unqualified name as per RPC encoding
    wsdl__xsd_string                   &:rsp	///< Output parameter, :unqualified name as per RPC encoding
);

/******************************************************************************\
 *                                                                            *
 * Service Operation                                                          *
 *   ns2__login_by_key                                                        *
 *                                                                            *
\******************************************************************************/

/// Operation response struct "ns2__login_by_keyResponse" of operation "ns2__login_by_key".
struct ns2__login_by_keyResponse
{
    ns2__result*                        :rslt;	///< Output parameter, :unqualified name as per RPC encoding
};

/** Operation "ns2__login_by_key" of service binding "myweb".
Service definition of function api__login_by_key

  - SOAP RPC encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"

  - Default endpoints:
    - http://localhost/myweb.cgi/myweb.cgi

  - Addressing input action: ""

  - Addressing output action: "Response"

C stub function (defined in soapClient.c[pp] generated by soapcpp2):
@code
  int soap_call_ns2__login_by_key(
    struct soap *soap,
    NULL, // char *endpoint = NULL selects default endpoint for this operation
    NULL, // char *action = NULL selects default action for this operation
    // input parameters:
    wsdl__xsd_string                    usr,
    wsdl__xsd_string                    psw,
    // output parameters:
    struct ns2__login_by_keyResponse&
  );
@endcode

C server function (called from the service dispatcher defined in soapServer.c[pp]):
@code
  int ns2__login_by_key(
    struct soap *soap,
    // input parameters:
    wsdl__xsd_string                    usr,
    wsdl__xsd_string                    psw,
    // output parameters:
    struct ns2__login_by_keyResponse&
  );
@endcode

C++ proxy class (defined in soapmywebProxy.h generated with soapcpp2):
@code
  class mywebProxy;
@endcode
Important: use soapcpp2 option '-j' (or '-i') to generate improved and easy-to-use proxy classes;

C++ service class (defined in soapmywebService.h generated with soapcpp2):
@code
  class mywebService;
@endcode
Important: use soapcpp2 option '-j' (or '-i') to generate improved and easy-to-use service classes;

*/

//gsoap ns2  service method-protocol:	login_by_key SOAP
//gsoap ns2  service method-style:	login_by_key rpc
//gsoap ns2  service method-encoding:	login_by_key http://schemas.xmlsoap.org/soap/encoding/
//gsoap ns2  service method-action:	login_by_key ""
//gsoap ns2  service method-output-action:	login_by_key Response
int ns2__login_by_key(
    wsdl__xsd_string                    :usr,	///< Input parameter, :unqualified name as per RPC encoding
    wsdl__xsd_string                    :psw,	///< Input parameter, :unqualified name as per RPC encoding
    struct ns2__login_by_keyResponse   &	///< Output response struct parameter
);

/** @page myweb Binding "myweb"

@section myweb_policy_enablers Policy Enablers of Binding "myweb"

None specified.

*/

/******************************************************************************\
 *                                                                            *
 * XML Data Binding                                                           *
 *                                                                            *
\******************************************************************************/


/** @page page_XMLDataBinding XML Data Binding

SOAP/XML services use data bindings that are contractually bound by WSDLs and
are auto-generated by wsdl2h and soapcpp2 (see Service Bindings). Plain data
bindings are adopted from XML schemas as part of the WSDL types section or when
running wsdl2h on a set of schemas to produce non-SOAP-based XML data bindings.

@note The following readers and writers are C/C++ data type (de)serializers
auto-generated by wsdl2h and soapcpp2. Run soapcpp2 on this file to generate the
(de)serialization code, which is stored in soapC.c[pp]. Include "soapH.h" in
your code to import these data type and function declarations. Only use the
soapcpp2-generated files in your project build. Do not include the wsdl2h-
generated .h file in your code.

@note Data can be read and deserialized from:
  - an int file descriptor, using soap->recvfd = fd
  - a socket, using soap->socket = (int)...
  - a C++ stream (istream, stringstream), using soap->is = (istream*)...
  - a C string, using soap->is = (const char*)...
  - any input, using the soap->frecv() callback

@note Data can be serialized and written to:
  - an int file descriptor, using soap->sendfd = (int)...
  - a socket, using soap->socket = (int)...
  - a C++ stream (ostream, stringstream), using soap->os = (ostream*)...
  - a C string, using soap->os = (const char**)...
  - any output, using the soap->fsend() callback

@note The following options are available for (de)serialization control:
  - soap->encodingStyle = NULL; to remove SOAP 1.1/1.2 encodingStyle
  - soap_set_mode(soap, SOAP_XML_TREE); XML without id-ref (no cycles!)
  - soap_set_mode(soap, SOAP_XML_GRAPH); XML with id-ref (including cycles)
  - soap_set_namespaces(soap, struct Namespace *nsmap); to set xmlns bindings


*/

/**

@section ns2 Top-level root elements of schema "urn:myweb"

*/

/* End of myweb.h */
