//
//  FaceDetector.hpp
//  eKYC
//
//  Created by Tung Nguyen on 06/07/2022.
//

#ifndef FaceDetector_hpp
#define FaceDetector_hpp

#include <stdio.h>
#include <string>
#include <opencv2/core/core.hpp>
#include <ncnn/ncnn/net.h>

struct Object
{
  cv::Rect_<float> rect;
  int label;
  float prob;
  std::vector<cv::Point2f> pts;
};

class FaceDetector {
  static ncnn::Net netInstance;
public:
  std::vector<Object> detectFromURL(std::string path_img, std::string path_dest);
  static void loadModel(std::string path_cfg, std::string path_weight)
      {
        netInstance.opt.num_threads=12;
        netInstance.load_param(path_cfg.data());
        netInstance.load_model(path_weight.data());
      }
};


#endif /* FaceDetector_hpp */
