package com.ekycproject.viettelEkyc

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Color
import com.ekycproject.viettelEkyc.utils.BitmapAdapterFactory
import com.ekycproject.viettelEkyc.utils.SuperclassExclusionStrategy
import com.ekycproject.viettelEkyc.utils.BitmapUtils
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.gson.GsonBuilder
import com.viettel.ekyc.ViettelEkycSDK
import com.viettel.ekyc.data.config.request.AdvancedLivenessConfig
import com.viettel.ekyc.data.config.request.EkycConfig
import com.viettel.ekyc.data.config.request.EkycConfigBuilder
//import com.viettel.ekyc.data.config.request.NfcUiConfig
import com.viettel.ekyc.data.model.KycNormalFlowResult
import com.viettel.ekyc.data.model.KycUIFlowResult
import com.viettel.ekyc.data.model.ResultState
import com.viettel.ekyc.tracking.EkycTracking
import com.viettel.ekyc.tracking.EventAction
import com.viettel.ekyc.tracking.EventSrc
import com.viettel.ekyc.tracking.ObjectType
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.util.*


class ViettelEkycModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    private var callBack: Promise? = null
    private var currentSdkType: EkycConfig.SdkType = EkycConfig.SdkType.NORMAL

    private val gson = GsonBuilder()
        .addSerializationExclusionStrategy(SuperclassExclusionStrategy())
        .addDeserializationExclusionStrategy(SuperclassExclusionStrategy())
        .registerTypeAdapterFactory(BitmapAdapterFactory())
        .serializeNulls()
        .create()

    override fun getName(): String {
        return NAME
    }

    init {
        reactContext.addActivityEventListener(this)
    }

    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    fun multiply(a: Double, b: Double, promise: Promise) {
        promise.resolve(a * b)
    }

    private val tracking = object : EkycTracking {
        override fun createEventAndTrack(
            objectName: String,
            eventSrc: EventSrc,
            objectType: ObjectType,
            action: EventAction,
            eventValue: Map<String, Any>?
        ) {
            val trackingObject = TrackingObject(
                objectName = objectName,
                eventSrc = eventSrc.name,
                objectType = objectType.name,
                action = action.name,
                eventValue = eventValue,
            )

            sendEvent(reactContext, "trackEvent", jsonToReact(JSONObject(gson.toJson(trackingObject))))
        }
    }


    @ReactMethod
    fun startEkyc(config: ReadableMap, promise: Promise) {
        val activity = reactContext.currentActivity ?: return

        try {
            val config = buildConfigFromJs(config)
            ViettelEkycSDK.startEkyc(activity, config)
            ViettelEkycSDK.setTracker(tracking)

            callBack = promise
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @kotlin.jvm.Throws
    fun buildConfigFromJs(config: ReadableMap): EkycConfig {
        val clientCode = config.getString("clientCode")
        val token = config.getString("token")
        if (clientCode.isNullOrBlank() || token.isNullOrBlank()) {
            throw Exception("clientCode and token are required")
        }

        val builder = EkycConfigBuilder(clientCode, token)

        config.getString("userIdType")?.also {
            if (it == "PHONE_NUM_TYPE") {
                builder.setUserIdType(EkycConfig.UserIdType.PHONE_NUM_TYPE)

            } else if (it == "IDCARD_ID_TYPE") {
                builder.setUserIdType(EkycConfig.UserIdType.IDCARD_ID_TYPE)
            }
        }
        config.getArray("idCardTypes")?.toArrayList()?.let {
            val idCardTypes = it.map { item ->
                when (item.toString()) {
                    "CMND" -> EkycConfig.IdCardType.CMND
                    "CCCD" -> EkycConfig.IdCardType.CCCD
                    "PASSPORT" -> EkycConfig.IdCardType.PASSPORT
                    "BLX" -> EkycConfig.IdCardType.BLX
                    "CMQD" -> EkycConfig.IdCardType.CMQD
                    else -> throw Exception("invalid idCardTypes")
                }
            }

            builder.setIdCardTypes(idCardTypes)
        }

        config.getString("flowType")?.let {
            val flowType = when (it) {
                "EKYC_FULL" -> EkycConfig.FlowType.EKYC_FULL
                "FACE_FULL" -> EkycConfig.FlowType.FACE_FULL
                "ID_CARD_FULL" -> EkycConfig.FlowType.ID_CARD_FULL
                "ID_CARD_FRONT" -> EkycConfig.FlowType.ID_CARD_FRONT
                "ID_CARD_BACK" -> EkycConfig.FlowType.ID_CARD_BACK
                "FACE_SEARCH" -> EkycConfig.FlowType.FACE_SEARCH
                else -> throw Exception("invalid flowType")
            }

            builder.setFlowType(flowType)
        }

        config.getString("uiFlowType").let {
            val uiFlowType = when (it) {
                "ID_CARD_FRONT" -> EkycConfig.UiFlowType.ID_CARD_FRONT
                "ID_CARD_BACK" -> EkycConfig.UiFlowType.ID_CARD_BACK
                "FACE_BASIC" -> EkycConfig.UiFlowType.FACE_BASIC
                "FACE_ADVANCED" -> EkycConfig.UiFlowType.FACE_ADVANCED
//                "UI_NFC" -> EkycConfig.UiFlowType.UI_NFC

                else -> throw Exception("invalid uiFlowType")
            }

            builder.setUiFlowType(uiFlowType)
        }

        config.getString("sdkType").let {
            currentSdkType = when (it) {
                "UI_ONLY" -> EkycConfig.SdkType.UI_ONLY
                "NORMAL" -> EkycConfig.SdkType.NORMAL

                else -> throw Exception("invalid sdkType")
            }



            builder.setSdkType(currentSdkType)
        }

        config.getString("userId")?.let {
            builder.setUserId(it)
        }


        config.getString("proxyUrl")?.let {
            builder.setProxyUrl(it)
        }
        config.getString("requestId")?.let {
            builder.setRequestId(it)
        }
        config.getString("xRequestId")?.let {
            builder.setXRequestId(it)
        }
        config.getString("frontIdCardId")?.let {
            builder.setFrontIdCardId(it)
        }
        if (config.hasKey("isImageId")) {
            builder.isImageId(config.getBoolean("isImageId"))
        }
        if (config.hasKey("isCacheImage")) {
            builder.isCacheImage(config.getBoolean("isCacheImage"))
        }
        if (config.hasKey("isSaveVideo")) {
            builder.isSaveVideo(config.getBoolean("isSaveVideo"))
        }
        if (config.hasKey("isAdvancedMatching")) {
            builder.setAdvanceFaceMatching(config.getBoolean("isAdvancedMatching"))
        }
        if (config.hasKey("isAdvancedLiveness")) {
            builder.setAdvancedLiveness(config.getBoolean("isAdvancedLiveness"))
        }
        if (config.hasKey("advancedLivenessConfig")) {
            val template = AdvancedLivenessConfig()
            val rawAdvancedLivenessConfigconfig = config.getMap("advancedLivenessConfig")!!
            val leftAngle = rawAdvancedLivenessConfigconfig.getInt("leftAngle")
            val rightAngle = rawAdvancedLivenessConfigconfig.getInt("rightAngle")
            val challengeRetakeLimit = rawAdvancedLivenessConfigconfig.getInt("challengeRetakeLimit")
            val duration = rawAdvancedLivenessConfigconfig.getInt("duration")

            builder.setAdvancedLivenessConfig(
                AdvancedLivenessConfig(
                    leftAngle = if (leftAngle > 0) leftAngle else template.leftAngle,
                    rightAngle = if (rightAngle > 0) rightAngle else template.rightAngle,
                    duration = if (duration > 0) duration else template.duration,
                    challengeRetakeLimit = if (challengeRetakeLimit > 0) challengeRetakeLimit else template.challengeRetakeLimit,
                )
            )
        }
        if (config.hasKey("isFaceSearch")) {
            builder.isFaceSearch(config.getBoolean("isFaceSearch"))
        }
        if (config.hasKey("isFaceSave")) {
            builder.isFaceSave(config.getBoolean("isFaceSave"))
        }
        if (config.hasKey("isFaceUpdate")) {
            builder.isFaceUpdate(config.getBoolean("isFaceUpdate"))
        }
        if (config.hasKey("isFaceQuality")) {
            builder.isFaceQuality(config.getBoolean("isFaceQuality"))
        }
        if (config.hasKey("isFaceLiveness")) {
            builder.isLivenessCheck(config.getBoolean("isFaceLiveness"))
        }
        if (config.hasKey("showHelp")) {
            builder.setShowHelp(config.getBoolean("showHelp"))
        }
        if (config.hasKey("enableVoiceHelp")) {
            builder.setEnableVoiceHelp(config.getBoolean("enableVoiceHelp"))
        }
        if (config.hasKey("showAutoCaptureButton")) {
            builder.setShowAutoCaptureButton(config.getBoolean("showAutoCaptureButton"))
        }
        if (config.hasKey("autoCaptureMode")) {
            builder.setAutoCaptureMode(config.getBoolean("autoCaptureMode"))
        }
        config.getString("backgroundColor")?.let {
            builder.setBackgroundColor(Color.parseColor(it))
        }
        config.getString("textColor")?.let {
            builder.setTextColor(Color.parseColor(it))
        }
        config.getString("popupBackgroundColor")?.let {
            builder.setPopupBackgroundColor(Color.parseColor(it))
        }
        config.getString("buttonColor")?.let {
            builder.setButtonColor(Color.parseColor(it))
        }
        config.getString("setButtonCornerRadius")?.let {
            // to-do: builder.setButtonCornerRadius(Color.parseColor(it))
        }
        config.getString("setFonts")?.let {
            // to-do: builder.setFonts(Color.parseColor(it))
        }
        if (config.hasKey("flash")) {
            builder.setShowFlashButton(config.getBoolean("flash"))
        }
        config.getDouble("zoom").let {
            if (it > 0) builder.setZoom(it.toInt())
        }
        config.getString("idCardCameraMode")?.let {
            val mode = if (it == "FRONT") EkycConfig.CameraMode.FRONT else EkycConfig.CameraMode.BACK
            builder.setIdCardCameraMode(mode)
        }
        config.getString("selfieCameraMode")?.let {
            val mode = if (it == "FRONT") EkycConfig.CameraMode.FRONT else EkycConfig.CameraMode.BACK
            builder.setSelfieCameraMode(mode)
        }
//    if (config.hasKey("isDebug")) {
//      builder.setDebug(config.getBoolean("isDebug"))
//    }
        if (config.hasKey("isDebug")) {
            builder.setDebug(config.getBoolean("isDebug"))
        }
        if (config.hasKey("iouCaptureTime")) {
            builder.setIouCaptureTime(config.getInt("iouCaptureTime"))
        }
        if (config.hasKey("iouThreshold")) {
            builder.setIouThreshold(config.getDouble("iouThreshold").toFloat())
        }
        if (config.hasKey("skipConfirmScreen")) {
            builder.setSkipConfirmScreen(config.getBoolean("skipConfirmScreen"))
        }
        if (config.hasKey("faceMinRatio")) {
            builder.setFaceMinRatio(config.getDouble("faceMinRatio").toFloat())
        }
        if (config.hasKey("faceMaxRatio")) {
            builder.setFaceMaxRatio(config.getDouble("faceMaxRatio").toFloat())
        }
        if (config.hasKey("faceRetakeLimit")) {
            builder.setFaceRetakeLimit(config.getInt("faceRetakeLimit"))
        }
        if (config.hasKey("idCardMinRatio")) {
            builder.setIdCardMinRatio(config.getDouble("idCardMinRatio").toFloat())
        }
        if (config.hasKey("cardRetakeLimit")) {
            builder.setIdCardRetakeLimit(config.getInt("cardRetakeLimit"))
        }
        if (config.hasKey("isCardQualityCheck")) {
            builder.isIdCardQuality(config.getBoolean("isCardQualityCheck"))
        }
        if (config.hasKey("isCardSpoofCheck")) {
            builder.isIdCardSpoof(config.getBoolean("isCardSpoofCheck"))
        }
        if (config.hasKey("idCardAbbr")) {
            builder.setIdCardAbbr(config.getBoolean("idCardAbbr"))
        }
        if (config.hasKey("idCardBoxPercentage")) {
            builder.setIdCardBoxPercentage(config.getDouble("idCardBoxPercentage").toFloat())
        }
        if (config.hasKey("nfcUiConfig")) {
            val nfcUiConfig = config.getMap("nfcUiConfig")!!
            val idNumber = nfcUiConfig.getString("idNumber")
            val birthDate = nfcUiConfig.getString("birthDate")
            val expiredDate = nfcUiConfig.getString("expiredDate")
//            builder.setNfcUiConfig(
//                NfcUiConfig(
//                    idNumber = idNumber ?: "",
//                    birthDate = birthDate ?: "",
//                    expiredDate = expiredDate ?: "",
//                )
//            )
        }
        if (config.hasKey("isNfc")) {
//            builder.setNfc(config.getBoolean("isNfc"))
        }
        config.getString("nfcVerifyOption")?.let {
            val option =
                if (it == "FACE_VERIFY") EkycConfig.NfcVerifyOption.FACE_VERIFY else EkycConfig.NfcVerifyOption.CHIP_DATA_VERIFY
//            builder.setNfcVerifyOption(option)
        }
        config.getString("advancedGuideVideoUrl")?.let {
            builder.setAdvancedGuideVideoUrl(it)
        }

        return builder.build();
    }

    companion object {
        const val NAME = "ViettelEkyc"
    }

    override fun onActivityResult(p0: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (currentSdkType == EkycConfig.SdkType.UI_ONLY) {
            val ekycResult = ViettelEkycSDK.getUiFlowResult(requestCode, resultCode, data) ?: KycUIFlowResult(
                resultState = ResultState.UserCancelled
            )
            callBack?.resolve(jsonToReact(JSONObject(gson.toJson(ekycResult))))
        } else {
            val result =
                ViettelEkycSDK.getNormalFlowResult(requestCode, resultCode, data) ?: KycNormalFlowResult(
                    resultState = ResultState.UserCancelled
                )
            callBack?.resolve(jsonToReact(JSONObject(gson.toJson(result))))
        }
    }

    @Throws(JSONException::class)
    fun jsonToReact(jsonObject: JSONObject): WritableMap? {
        val writableMap = Arguments.createMap()
        val iterator: Iterator<*> = jsonObject.keys()
        while (iterator.hasNext()) {
            val key = iterator.next() as String
            val value = jsonObject[key]
            if (value is Float || value is Double) {
                writableMap.putDouble(key, jsonObject.getDouble(key))
            } else if (value is Bitmap) {
                val bitmap = jsonObject.getJSONObject(key) as Bitmap
                writableMap.putString(key, BitmapUtils.bitmapToBase64(bitmap))
            } else if (value is Number) {
                writableMap.putInt(key, jsonObject.getInt(key))
            } else if (value is String) {
                writableMap.putString(key, jsonObject.getString(key))
            } else if (value is JSONObject) {
                writableMap.putMap(key, jsonToReact(jsonObject.getJSONObject(key)))
            } else if (value is JSONArray) {
                writableMap.putArray(key, jsonToReact(jsonObject.getJSONArray(key)))
            } else if (value === JSONObject.NULL) {
                writableMap.putNull(key)
            }
        }
        return writableMap
    }


    @Throws(JSONException::class)
    fun jsonToReact(jsonArray: JSONArray): WritableArray? {
        val writableArray = Arguments.createArray()
        for (i in 0 until jsonArray.length()) {
            val value: Any = jsonArray.get(i)
            if (value is Float || value is Double) {
                writableArray.pushDouble(jsonArray.getDouble(i))
            } else if (value is Number) {
                writableArray.pushInt(jsonArray.getInt(i))
            } else if (value is String) {
                writableArray.pushString(jsonArray.getString(i))
            } else if (value is JSONObject) {
                writableArray.pushMap(jsonToReact(jsonArray.getJSONObject(i)))
            } else if (value is JSONArray) {
                writableArray.pushArray(jsonToReact(jsonArray.getJSONArray(i)))
            } else if (value === JSONObject.NULL) {
                writableArray.pushNull()
            }
        }
        return writableArray
    }


    override fun onNewIntent(p0: Intent?) {

    }
}
