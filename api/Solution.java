package api;
import java.util.*;
import java.io.*;
import java.math.*;

class Solution {

    public static void main(String args[]) {



        int i = 12;
        int a = 0;
        String s = "123a";
        char b = 'a';
        b = Character.toUpperCase(b);

        String str = String.valueOf(i);
        try {
            a = Integer.valueOf(s);
            
        } catch (Exception e) {
        }
        System.out.println(str);
        System.out.println("a = " + a);
        System.out.println("b = " + b);
    }
}