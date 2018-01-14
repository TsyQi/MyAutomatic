//CVML
#ifdef WIN32
#include "../MfcUtil/opencv/CvimgMat.h"
#else
#include "../MfcUtil/py/CPyTensor.h"
#endif

int main()
{
#ifdef WIN32
	CvimgMat vm;
	vm.cvmat_test();
#else
	CPyTensor tf;
	tf.testPyfunc();
#endif
    return 0;
}
