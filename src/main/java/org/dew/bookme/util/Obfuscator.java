package org.dew.bookme.util;

public
class Obfuscator
{
  /**
   * Esegue il criptaggio del testo.
   *
   * @param sText String
   * @return String
   */
  public static
  String encrypt(String sText)
  {
    if(sText == null) {
      return null;
    }
    
    // La chiave puo' contenere caratteri che appartengono all'insieme
    // [32 (spazio) - 95 (_)]
    String sKey = "@D:=E?('B;F)<=A>C@?):D';@=B<?C;)E:'@=?A(B<=;(?@>E:";
    
    int k = 0;
    StringBuffer sb = new StringBuffer(sText.length());
    for(int i = 0; i < sText.length(); i++) {
      if(k >= sKey.length() - 1) {
        k = 0;
      }
      else {
        k++;
      }
      
      int c = sText.charAt(i);
      int d = sKey.charAt(k);
      
      int r = c;
      if(c >= 32 && c <= 126) {
        r = r - d;
        if(r < 32) {
          r = 127 + r - 32;
        }
      }
      
      sb.append((char) r);
    }
    
    return sb.toString();
  }
  
  /**
   * Esegue il decriptaggio del testo.
   *
   * @param sText String
   * @return String
   */
  public static
  String decrypt(String sText)
  {
    if(sText == null) {
      return null;
    }
    
    // La chiave puo' contenere caratteri che appartengono all'insieme
    // [32 (spazio) - 95 (_)]
    String sKey = "@D:=E?('B;F)<=A>C@?):D';@=B<?C;)E:'@=?A(B<=;(?@>E:";
    
    int k = 0;
    StringBuffer sb = new StringBuffer(sText.length());
    for(int i = 0; i < sText.length(); i++) {
      if(k >= sKey.length() - 1) {
        k = 0;
      }
      else {
        k++;
      }
      
      int c = sText.charAt(i);
      int d = sKey.charAt(k);
      
      int r = c;
      if(c >= 32 && c <= 126) {
        r = r + d;
        if(r > 126) {
          r = 31 + r - 126;
        }
      }
      
      sb.append((char) r);
    }
    
    return sb.toString();
  }
}
