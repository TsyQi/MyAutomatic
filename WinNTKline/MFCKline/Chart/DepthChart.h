#ifndef CHART_DEPTH_H_
#define CHART_DEPTH_H_
#include "OGL/OGLKview.h"

class DepthChart
{
public:
	static DepthChart* getDepth();
	virtual ~DepthChart();
	void DrawItem(OGLKview::Item item, int col);
	int DrawItem(OGLKview::Item item,bool mode=false);
	void FillChart(bool unfurl);
	void DelItem(int item);
	OGLKview::Item item;
private:
	float Py, Pm;
	int hour = 0;
	int column = 0;
	int MAX_COL = 17;
	OGLKview Okv;
	OGLKview::Color4f color = { 1,1,1,1 };
	static DepthChart *depth;
private:
	DepthChart();
	void fillitem();
	void drawList(void);
	void fillAskbid(OGLKview::Point pt);
};
#endif // !CHART_DEPTH_H_