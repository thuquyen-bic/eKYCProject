package com.ekycproject.viettelEkyc

data class TrackingObject(
    val objectName: String,
    val eventSrc: String,
    val objectType: String,
    val action: String,
    val eventValue: Map<String, Any>?,
)
