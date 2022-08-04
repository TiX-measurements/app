package com.taller3.tixApp;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import android.util.Log;
import java.time.*;
import java.util.Base64;
import java.util.TimeZone;
import java.util.concurrent.atomic.AtomicLong;

public class TimestampModule extends ReactContextBaseJavaModule {
   TimestampModule(ReactApplicationContext context) {
       super(context);
   }

   // add to CalendarModule.java
    @Override
    public String getName() {
        return "TimestampModule";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Double getTimestamp() {
        return Double.valueOf(new NanosOfDayTimestampSupplier().get());
    }

    private static class NanosOfDayTimestampSupplier {
		private final long startNanos;
		private final long nanoDeltaToEpoch;

		private static long millisToNanos(long millis) {
			return millis * 1000000;
		}

		public NanosOfDayTimestampSupplier() {
			startNanos = System.nanoTime();
			long currentMillis = System.currentTimeMillis();
			long currentMillisInNanos = millisToNanos(currentMillis);
			long currentNanos = System.nanoTime();
			nanoDeltaToEpoch = currentMillisInNanos - currentNanos;
		}

		public long get() {
			long todayStartMillis = LocalDate.now().atStartOfDay(ZoneId.of(ZoneOffset.UTC.getId())).toInstant().toEpochMilli();
			long todayStartNanos = millisToNanos(todayStartMillis);
			long currentNanos = System.nanoTime();
			return currentNanos + nanoDeltaToEpoch - todayStartNanos;
		}
	}

}