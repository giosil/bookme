package org.dew.bookme.util;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.util.WUtil;

public 
class DataUtil
{
  public static 
  Map<String,Object> buildMap(String key0, Object val0)
  {
    Map<String,Object> mapResult = new HashMap<String,Object>();
    if(key0 != null && key0.length() > 0 && val0 != null) {
      mapResult.put(key0, val0);
    }
    return mapResult;
  }
  
  public static 
  Map<String,Object> buildMap(String key0, Object val0, String key1, Object val1)
  {
    Map<String,Object> mapResult = new HashMap<String,Object>();
    if(key0 != null && key0.length() > 0 && val0 != null) {
      mapResult.put(key0, val0);
    }
    if(key1 != null && key1.length() > 0 && val1 != null) {
      mapResult.put(key1, val1);
    }
    return mapResult;
  }
  
  public static
  Map<String,Object> buildChartData(List<String> labels, List<Number> serie0)
  {
    Map<String,Object> mapResult = new HashMap<String,Object>(2);
    
    if(labels == null) labels = new ArrayList<String>(0);
    mapResult.put("labels", labels);
    
    List<List<Number>> series  = new ArrayList<List<Number>>();
    if(serie0 == null) serie0 = new ArrayList<Number>(0);
    series.add(serie0);
    mapResult.put("series", series);
    
    return mapResult;
  }
  
  public static
  Map<String,Object> buildChartData(List<String> labels, String title, List<Number> serie0)
  {
    Map<String,Object> mapResult = new HashMap<String,Object>(3);
    
    if(labels == null) labels = new ArrayList<String>(0);
    mapResult.put("labels", labels);
    
    List<String> titles = new ArrayList<String>();
    if(title == null) title = "";
    titles.add(title);
    mapResult.put("titles", titles);
    
    List<List<Number>> series  = new ArrayList<List<Number>>();
    if(serie0 == null) serie0 = new ArrayList<Number>(0);
    series.add(serie0);
    mapResult.put("series", series);
    
    return mapResult;
  }
  
  public static
  Set<Integer> getSetOfInteger(List<Map<String,Object>> listData, String key)
  {
    if(listData == null || listData.size() == 0) {
      return new HashSet<Integer>(0);
    }
    if(key == null || key.length() == 0) {
      return new HashSet<Integer>(0);
    }
    Set<Integer> setResult = new HashSet<Integer>(listData.size());
    for(int i = 0; i < listData.size(); i++) {
      Map<String,Object> mapItem = listData.get(i);
      if(mapItem == null) continue;
      Object value = mapItem.get(key);
      if(value == null) continue;
      int iValue = WUtil.toInt(value, 0);
      if(iValue == 0) continue;
      setResult.add(iValue);
    }
    return setResult;
  }
  
  public static
  int diffMinutes(Calendar calDtFine, Calendar calDtInizio)
  {
    int iDataFine   = WUtil.toIntDate(calDtFine,   0);
    int iOraFine    = WUtil.toIntTime(calDtFine,   0);
    int iDataInizio = WUtil.toIntDate(calDtInizio, 0);
    int iOraInizio  = WUtil.toIntTime(calDtInizio, 0);
    return diffMinutes(iDataFine, iOraFine, iDataInizio, iOraInizio);
  }
  
  public static
  int diffMinutes(int iOraFine, int iOraInizio)
  {
    int iHourBegin   = iOraInizio / 100;
    int iMinuteBegin = iOraInizio % 100;
    int iHourEnd     = iOraFine / 100;
    int iMinuteEnd   = iOraFine % 100;
    return (iHourEnd - iHourBegin) * 60 + (iMinuteEnd - iMinuteBegin);
  }
  
  public static
  int diffMinutes(int iDataFine, int iOraFine, int iDataInizio, int iOraInizio)
  {
    int iDays = diffDays(iDataFine, iDataInizio);
    int iHourBegin   = iOraInizio / 100;
    int iMinuteBegin = iOraInizio % 100;
    int iHourEnd     = iOraFine / 100 + iDays * 24;
    int iMinuteEnd   = iOraFine % 100;
    return (iHourEnd - iHourBegin) * 60 + (iMinuteEnd - iMinuteBegin);
  }
  
  public static
  int diffDays(int iDataFine, int iDataInizio)
  {
    long lTimeDataFine   = intToLongDate(iDataFine);
    long lTimeDataInizio = intToLongDate(iDataInizio);
    long lDiffTime       = lTimeDataFine - lTimeDataInizio;
    if(lDiffTime <= 0) return 0;
    int iDivisione  = (int) ((lDiffTime) / (1000 * 60 * 60 * 24));
    int iResto      = (int) ((lDiffTime) % (1000 * 60 * 60 * 24));
    int iRestoInOre = iResto / (1000 * 60 * 60);
    int iResult     = iDivisione;
    if(iRestoInOre > 12) { // Passaggio dall'ora solare all'ora legale...
      iResult++;
    }
    return iResult;
  }
  
  public static
  int diffDays(Calendar dateTimeHigher, Calendar dateTimeLower)
  {
    long lDiffTime = dateTimeHigher.getTimeInMillis() - dateTimeLower.getTimeInMillis();
    if(lDiffTime <= 0) return 0;
    int iDivisione = (int)((lDiffTime) /(1000 * 60 * 60 * 24));
    int iResto = (int)((lDiffTime) %(1000 * 60 * 60 * 24));
    int iRestoInOre = iResto /(1000 * 60 * 60);
    int iResult = iDivisione;
    if(iRestoInOre > 12) { // Passaggio dall'ora solare all'ora legale...
      iResult++;
    }
    return iResult;
  }
  
  public static
  int addMinutes(int iOra, int iMinutes)
  {
    int iHH  = iOra / 100;
    int iMM  = iOra % 100;
    int iIdx = iHH * 60 + iMM;
    iIdx += iMinutes;
    int iHHR  = iIdx / 60;
    int iMMR  = iIdx % 60;
    return iHHR * 100 + iMMR;
  }
  
  public static
  long intToLongDate(int iDate)
  {
    if(iDate == 0) return 0;
    int iYear = iDate / 10000;
    int iMonth = (iDate % 10000) / 100;
    iMonth -= 1;
    int iDay = (iDate % 10000) % 100;
    return new GregorianCalendar(iYear, iMonth, iDay, 0, 0, 0).getTime().getTime();
  }
  
  public static
  boolean reserve(StringBuffer sbModello, int iOraAppuntamento, int iDurata, boolean check)
  {
    int iHH  = iOraAppuntamento / 100;
    int iMM  = iOraAppuntamento % 100;
    int iIdx = iHH * 60 + iMM;
    int iEnd = iIdx + iDurata;
    if(iEnd > 1440) return false;
    for(int i = iIdx; i < iEnd; i++) {
      char c = sbModello.charAt(i);
      if(check && c == '0') return false;
      sbModello.setCharAt(i, '0');
    }
    return true;
  }
  
  public static
  boolean isAvailable(StringBuffer sbModello, int iOraAppuntamento, int iDurata)
  {
    int iHH  = iOraAppuntamento / 100;
    int iMM  = iOraAppuntamento % 100;
    int iIdx = iHH * 60 + iMM;
    int iEnd = iIdx + iDurata;
    if(iEnd > 1440) return false;
    for(int i = iIdx; i < iEnd; i++) {
      char c = sbModello.charAt(i);
      if(c == '0') return false;
    }
    return true;
  }
  
  public static
  boolean isAvailable(String sModello, int iOraAppuntamento, int iDurata)
  {
    int iHH  = iOraAppuntamento / 100;
    int iMM  = iOraAppuntamento % 100;
    int iIdx = iHH * 60 + iMM;
    int iEnd = iIdx + iDurata;
    if(iEnd > 1440) return false;
    for(int i = iIdx; i < iEnd; i++) {
      char c = sModello.charAt(i);
      if(c == '0') return false;
    }
    return true;
  }
  
  public static
  int closeSlot(int iOra)
  {
    if(iOra < 0) return 0;
    int iHH  = iOra / 100;
    int iMM  = iOra % 100;
    int iIdx = iHH * 60 + iMM;
    for(int i = 0; i < 10; i++) {
      iIdx += 1;
      if(iIdx % 10 == 0) {
        int iHHR  = iIdx / 60;
        int iMMR  = iIdx % 60;
        return iHHR * 100 + iMMR;
      }
    }
    int iHHR  = iIdx / 60;
    int iMMR  = iIdx % 60;
    return iHHR * 100 + iMMR;
  }
  
  public static
  boolean free(StringBuffer sbModello, int iOraAppuntamento, int iDurata)
  {
    int iHH  = iOraAppuntamento / 100;
    int iMM  = iOraAppuntamento % 100;
    int iIdx = iHH * 60 + iMM;
    int iEnd = iIdx + iDurata;
    if(iEnd > 1440) return false;
    for(int i = iIdx; i < iEnd; i++) {
      sbModello.setCharAt(i, '1');
    }
    return true;
  }
  
  public static
  int getDisponibili(StringBuffer sbModello)
  {
    if(sbModello == null) return 0;
    int iResult = 0;
    for(int i = 0; i < sbModello.length(); i++) {
      char c = sbModello.charAt(i);
      if(c == '1') iResult++;
    }
    return iResult;
  }
  
  public static
  int getMaxConsecutivi(StringBuffer sbModello)
  {
    if(sbModello == null) return 0;
    int iResult = 0;
    int iCountAdiacenti = 0;
    for(int i = 0; i < sbModello.length(); i++) {
      char c = sbModello.charAt(i);
      if(c == '1') {
        iCountAdiacenti++;
      }
      else {
        if(iCountAdiacenti > iResult) {
          iResult = iCountAdiacenti;
        }
        iCountAdiacenti = 0;
      }
    }
    return iResult;
  }
  
  public static
  boolean isHoliday(int iDate)
  {
    if(iDate == 0) return false;
    
    int iYear  = iDate / 10000;
    int iMonth = (iDate % 10000) / 100;
    int iDay   = (iDate % 10000) % 100;
    
    Calendar calendar = computeEaster(iYear); // Pasqua
    if(calendar != null) {
      calendar.add(Calendar.DATE, 1);  // Lunedi' dell'Angelo (Pasquetta)
      int iDayAfterEaster = WUtil.toIntDate(calendar, 0);
      if(iDate == iDayAfterEaster) return true;
    }
    
    List<Integer> holidays = new ArrayList<Integer>();
    holidays.add(new Integer(99990101)); // Capodanno
    holidays.add(new Integer(99990106)); // Epifania
    holidays.add(new Integer(99990425)); // Festa della Liberazione
    holidays.add(new Integer(99990501)); // Festa dei Lavoratori
    holidays.add(new Integer(99990602)); // Festa della Repubblica
    holidays.add(new Integer(99990815)); // Ferragosto
    holidays.add(new Integer(99991101)); // Tutti i santi
    holidays.add(new Integer(99991208)); // Immacolata
    holidays.add(new Integer(99991225)); // Natale
    holidays.add(new Integer(99991226)); // Santo Stefano
    
    int iGenDate = 9999 * 10000 + iMonth * 100 + iDay;
    return holidays.contains(iGenDate);
  }
  
  /*
   * Compute the day of the year that Easter falls on. Step names E1 E2 etc.,
   * are direct references to Knuth, Vol 1, p 155. @exception
   * IllegalArgumentexception If the year is before 1582 (since the algorithm
   * only works on the Gregorian calendar).
   */
  public static 
  Calendar computeEaster(int year) 
  {
    if (year <= 1582) {
      // Algorithm invalid before April 1583
      return null;
    }
    int golden, century, x, z, d, epact, n;
    golden = (year % 19) + 1; /* E1: metonic cycle */
    century = (year / 100) + 1; /* E2: e.g. 1984 was in 20th C */
    x = (3 * century / 4) - 12; /* E3: leap year correction */
    z = ((8 * century + 5) / 25) - 5; /* E3: sync with moon's orbit */
    d = (5 * year / 4) - x - 10;
    epact = (11 * golden + 20 + z - x) % 30; /* E5: epact */
    if ((epact == 25 && golden > 11) || epact == 24) epact++;
    n = 44 - epact;
    n += 30 * (n < 21 ? 1 : 0); /* E6: */
    n += 7 - ((d + n) % 7);
    if (n > 31) /* E7: */
      return new GregorianCalendar(year, 4 - 1, n - 31); /* April */
    else
      return new GregorianCalendar(year, 3 - 1, n); /* March */
  }
  
  public static
  double minutesToHHMM(int iMin)
  {
    int HH = iMin / 60;
    int MM = iMin % 60;
    if(MM < 10) {
      return Double.parseDouble(HH + ".0" + MM);
    }
    return Double.parseDouble(HH + "." + MM);
  }
  
  public static
  java.sql.Date addDays(java.sql.Date date, int iDays)
  {
    if(iDays == 0 || date == null) {
      return date;
    }
    Calendar calendar = Calendar.getInstance();
    calendar.setTimeInMillis(date.getTime());
    calendar.add(Calendar.DATE, iDays);
    return new java.sql.Date(calendar.getTimeInMillis());
  }
  
  public static 
  String normalizePhoneNumber(String sNumber)
  {
    if(sNumber == null || sNumber.length() == 0) {
      return sNumber;
    }
    
    StringBuilder sb = new StringBuilder();
    for(int i = 0; i < sNumber.length(); i++) {
      char c = sNumber.charAt(i);
      if(c == '+' && sb.length() == 0) {
        sb.append(c);
        continue;
      }
      if(Character.isDigit(c)) {
        sb.append(c);
      }
    }
    String sResult = sb.toString();
    if(!sResult.startsWith("+")) {
      sResult = "+39" + sResult;
    }
    return sResult;
  }
}
