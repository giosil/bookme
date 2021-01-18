package org.dew.bookme.util;

import java.util.*;

import org.util.WUtil;

public 
class DateSplitter 
{
  private int iInitialDate;
  private int iEndDate;
  private int iCurrentDate;
  private boolean bHasNext = false;
  private boolean[] days = { false, false, false, false, false, false, false };
  
  public DateSplitter() 
  {
  }
  
  public void setInterval(int iInitialDate, int iEndDate) {
    this.iInitialDate = iInitialDate;
    this.iEndDate = iEndDate;
  }
  
  public void setInterval(Date dInitialDate, Date dEndDate) {
    this.iInitialDate = WUtil.toIntDate(dInitialDate, 0);
    this.iEndDate = WUtil.toIntDate(dEndDate, 0);
  }
  
  public void setDaysWeek(String sDays) {
    if (sDays == null) return;
    for (int i = 0; (i < sDays.length() && i < 7); i++) {
      if (sDays.charAt(i) == 'S')
        days[i] = true;
      else
        days[i] = false;
    }
  }
  
  public void setDayWeek(int day) {
    if (day < 1 || day > 7) return;
    days[day - 1] = true;
  }
  
  public void unsetDayWeek(int day) {
    if (day < 1 || day > 7) return;
    days[day - 1] = false;
  }
  
  public boolean isDayWeekSetted(int day) {
    if (day < 1 || day > 7) return false;
    return days[day - 1];
  }
  
  public void split() {
    bHasNext = false;
    
    if (iEndDate < iInitialDate) return;
    
    if (!checkDaysWeek()) return;
    
    iCurrentDate = iInitialDate;
    if (!isDayWeekSetted(getDayOfWeek(iCurrentDate))) {
      do {
        iCurrentDate = nextDay(iCurrentDate);
      } 
      while (!isDayWeekSetted(getDayOfWeek(iCurrentDate)));
      
      if (iCurrentDate > iEndDate)
        bHasNext = false;
      else
        bHasNext = true;
    } else {
      bHasNext = true;
    }
  }
  
  public boolean hasNext() {
    return bHasNext;
  }
  
  public int next() {
    if (!bHasNext) return 0;
    int result = iCurrentDate;
    do {
      iCurrentDate = nextDay(iCurrentDate);
    } 
    while (!isDayWeekSetted(getDayOfWeek(iCurrentDate)));
    if (iCurrentDate > iEndDate)
      bHasNext = false;
    return result;
  }
  
  private boolean checkDaysWeek() {
    boolean result = false;
    
    for (int i = 0; i < days.length; i++) {
      if (days[i]) {
        result = true;
        break;
      }
    }
    
    return result;
  }
  
  private static int nextDay(int iDate) {
    int iYear = iDate / 10000;
    int iMonth = (iDate % 10000) / 100;
    iMonth -= 1;
    int iDay = (iDate % 10000) % 100;
    
    Calendar cal = new GregorianCalendar(iYear, iMonth, iDay);
    cal.add(Calendar.DAY_OF_MONTH, 1);
    return cal.get(Calendar.DAY_OF_MONTH) + (cal.get(Calendar.MONTH) + 1) * 100 + cal.get(Calendar.YEAR) * 10000;
  }
  
  public static int getDayOfWeek(int iDate) {
    int iYear = iDate / 10000;
    int iMonth = (iDate % 10000) / 100;
    iMonth -= 1;
    int iDay = (iDate % 10000) % 100;
    
    Calendar cal = new GregorianCalendar(iYear, iMonth, iDay);
    
    int result = cal.get(Calendar.DAY_OF_WEEK);
    if (result == 1) return 7;
    return (result - 1);
  }
  
  public static int getDayOfWeek(Date dDate) {
    if(dDate == null) return 0;
    
    Calendar cal = Calendar.getInstance();
    cal.setTimeInMillis(dDate.getTime());
    
    int result = cal.get(Calendar.DAY_OF_WEEK);
    if (result == 1) return 7;
    return (result - 1);
  }
  
  // Si consiglia di utilizzare il metodo getWeek2020
  // Dopo l'anno bisestile si passa da una settimana dispari (ad es. il 3/01/2021 e' 53a settimana)
  // ad una settimana dispari (ad es. il 04/01/2021 e' 1a settimana).
  // Tale problema sfasa l'alternanza delle settimane.
  // Utilizzare getWeek2020 che usa come riferimento il 2020: non serve il numero della settimana in
  // se' ma e' necessario preservare l'alternanza pari / dispari.
  public static int _getWeekOfYear(int iDate) {
    int iYear = iDate / 10000;
    int iMonth = (iDate % 10000) / 100;
    iMonth -= 1;
    int iDay = (iDate % 10000) % 100;
    
    Calendar calendar = Calendar.getInstance(Locale.ITALY);
    calendar.set(Calendar.YEAR, iYear);
    calendar.set(Calendar.MONTH, iMonth);
    calendar.set(Calendar.DATE, iDay);
    
    return calendar.get(Calendar.WEEK_OF_YEAR);
  }
  
  public static int getWeek2020(int iDate) {
    int iYear = iDate / 10000;
    int iMonth = (iDate % 10000) / 100;
    iMonth -= 1;
    int iDay = (iDate % 10000) % 100;
    
    Calendar calendar = new GregorianCalendar(iYear, iMonth, iDay);
    
    // Il 30/12/2019 e' lunedi'
    int diff = DataUtil.diffDays(calendar, new GregorianCalendar(2019, 11, 30));
    return diff / 7 + 1;
  }
}
