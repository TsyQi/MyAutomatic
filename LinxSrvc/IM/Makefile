EXP =
CUR = `pwd`
GEN = $(CUR)/../bin
OBJ = $(CUR)/../obj
CXX =$(shell bash -c "if [[ \"$(command -v nvcc >/dev/null 2>&1 || { echo g++; EXP=-Wno-c++11-narrowing; })\" == \"\" ]];then echo nvcc;fi;")
FLAG = -g -std=c++11 -D_DEBUG 
PTHD = -lpthread
IMLOCAL=../../WinNTKline/KlineUtil/IM
IMFILE=$(IMLOCAL)/IM.cc
CLIENTLOCAL=../../WinNTKline/IMclient
CLIENTFILES=$(IMLOCAL)/IMclient.cpp $(CLIENTLOCAL)/client.cpp
all: IM client Kai
IM:
	if [ ! -d "$(GEN)" ]; then mkdir $(GEN); fi;
	$(CXX) $(FLAG) $(IMFILE) -o $(GEN)/IM.exe $(PTHD)
client:
	$(CXX) $(FLAG) -I$(IMLOCAL) $(CLIENTFILES) -o $(GEN)/Client.exe $(PTHD)
Kai:
	if [ ! -d "$(OBJ)" ]; then mkdir $(OBJ); fi;
	$(CXX) -c KaiSocket.cc $(FLAG) $(PTHD) $(EXP)
	$(CXX) KaiSocket.cc main.cpp $(FLAG) $(PTHD) -DCLIENT -o client.exe $(EXP)
	$(CXX) KaiSocket.cc main.cpp $(FLAG) $(PTHD) -o server.exe $(EXP)
	mv *.o $(OBJ)/
clean:
	rm -f $(GEN)/IM.exe $(GEN)/Client.exe $(OBJ)/*.o
	rm -f *.exe
