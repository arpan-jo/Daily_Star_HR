package com.ibos.dailystarhr
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothHeadset
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import android.widget.Toast
import com.dantsu.escposprinter.EscPosPrinter
import com.dantsu.escposprinter.connection.bluetooth.BluetoothPrintersConnections
import com.dantsu.escposprinter.textparser.PrinterTextParserImg
import com.facebook.react.bridge.*
import java.util.*

class ThermalModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    // override getName method
    override fun getName(): String {
        return "ThermalPrinter"
    }

    @ReactMethod
    fun isPrinterConnected(): Boolean {
        val mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter()
        return mBluetoothAdapter != null && mBluetoothAdapter.isEnabled &&
                mBluetoothAdapter.getProfileConnectionState(BluetoothHeadset.HEADSET) == BluetoothHeadset.STATE_CONNECTED
    }

    @ReactMethod
    fun print(caputedImg: String, promise: Promise) {
        try {
            val receipt = caputedImg
            val printer = EscPosPrinter(BluetoothPrintersConnections.selectFirstPaired(), 203, 70f, 48)

            val decodedString = Base64.decode(receipt, Base64.DEFAULT)
            val decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)

            val width = decodedByte.width
            val height = decodedByte.height
            val textToPrint = StringBuilder()

            for (y in 0 until height step 256) {
                val bitmap = Bitmap.createBitmap(decodedByte, 0, y, width, if (y + 256 >= height) height - y else 256)
                textToPrint.append("[C]<img>${PrinterTextParserImg.bitmapToHexadecimalString(printer, bitmap)}</img>\n")
            }

            for (i in 0 until 4) {
                textToPrint.append(if (i == 0) "[C]Thank You!!\n\n" else "[C]\n\n")
            }

            printer.printFormattedTextAndCut(textToPrint.toString())
            Toast.makeText(reactApplicationContext, "Thermal Printer success", Toast.LENGTH_LONG).show()
            promise.resolve("done")
        } catch (e: Exception) {
            promise.reject("DECRYPTION_FAILED", "Decryption Failed")
            Toast.makeText(reactApplicationContext, e.message, Toast.LENGTH_LONG).show()
        }
    }
}
