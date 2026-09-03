package com.printer // replace com.your-app-name with your app’s name
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

class PocketPrinterModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    // override getName method
    override fun getName(): String {
        return "PocketPrinter"
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

            // Init Printer
            val printer = EscPosPrinter(BluetoothPrintersConnections.selectFirstPaired(), 203, 65f, 32)

            val decodedString = Base64.decode(receipt, Base64.DEFAULT)
            val decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)

            val width = decodedByte.width
            val height = decodedByte.height

            val textToPrint = StringBuilder()
            for (y in 0 until height step 256) {
                val bitmap = Bitmap.createBitmap(decodedByte, 0, y, width, if (y + 256 >= height) height - y else 256)
                textToPrint.append("[C]<img>${PrinterTextParserImg.bitmapToHexadecimalString(printer, bitmap)}</img>\n")
            }

            textToPrint.append("[C]Thank You!!\n")

            printer.printFormattedTextAndCut(textToPrint.toString())
            Toast.makeText(reactApplicationContext, "Thermal Printer success", Toast.LENGTH_SHORT).show()
            printer.disconnectPrinter()
            promise.resolve("done")
        } catch (e: Exception) {
            promise.reject("DECRYPTION_FAILED", "Decryption Failed")
            Toast.makeText(reactApplicationContext, e.message, Toast.LENGTH_LONG).show()
        }
    }
}
