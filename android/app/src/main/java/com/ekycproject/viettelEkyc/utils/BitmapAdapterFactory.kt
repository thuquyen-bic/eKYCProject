package com.ekycproject.viettelEkyc.utils

import android.graphics.Bitmap
import com.google.gson.Gson
import com.google.gson.TypeAdapter
import com.google.gson.TypeAdapterFactory
import com.google.gson.reflect.TypeToken
import com.google.gson.stream.JsonReader
import com.google.gson.stream.JsonWriter
import java.io.IOException


class BitmapAdapterFactory : TypeAdapterFactory {
    override fun <T> create(gson: Gson?, type: TypeToken<T>): TypeAdapter<T>? {
        val rawType: Class<in T> = type.rawType
        return if (rawType == Bitmap::class.java) {
            MyEnumTypeAdapter<T>()
        } else null
    }

    inner class MyEnumTypeAdapter<T> : TypeAdapter<T>() {
        @Throws(IOException::class)
        override fun write(out: JsonWriter, value: T?) {
            if (value == null) {
                out.nullValue()
                return
            }
            val bitmap: Bitmap = value as Bitmap
            out.value(BitmapUtils.bitmapToBase64(bitmap))
        }

        @Throws(IOException::class)
        override fun read(`in`: JsonReader?): T? {
            // Properly deserialize the input (if you use deserialization)
            return null
        }
    }
}
