package com.ekycproject.viettelEkyc.utils

import android.graphics.Bitmap
import android.graphics.Rect
import android.util.Base64
import java.io.ByteArrayOutputStream
import kotlin.math.roundToInt

object BitmapUtils {

    fun bitmapToBase64(bitmap: Bitmap?): String? {
        bitmap ?: return null

        val stream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
        return Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP)
    }
}
