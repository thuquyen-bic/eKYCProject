# require "json"
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

Pod::Spec.new do |s|
  s.name         = "EkycModule"
  s.version      = "0.1.0"
  s.summary      = "A React Native module for eKYC."
  s.description  = <<-DESC
                   A React Native module for eKYC using eKYC.xcframework.
                   DESC
  s.homepage     = "https://example.com/EkycModule"
  s.license      = { :type => "GNU" }
  s.author       = { "Your Name" => "you@example.com" }

  s.platforms    = { :ios => "13.0" }
  s.source       = { :path => ".", :tag => "#{s.version}" }

  s.source_files  = "ios/**/*.{swift,h,m}"

  s.dependency "React-Core"
  s.dependency "CryptoSwift", "~> 1.4.1"
  s.dependency "OpenSSL-Universal"
  
  s.vendored_frameworks = "ios/Frameworks/eKYC.xcframework"

  # Don't install the dependencies when we run `pod install` in the old architecture.
  if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
    s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
    s.pod_target_xcconfig    = {
        "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
        "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
        "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
    }
    s.dependency "React-Codegen"
    s.dependency "RCT-Folly"
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/core"
  end
end
