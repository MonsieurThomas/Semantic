package api;
import java.util.*;
import java.io.*;
import java.math.*;

class Solution {

    public static void main(String args[]) {

        int N = 4;
        System.out.println(N+ "\n");

        int[] tab = new int[N];
        int []tabData = {4,6,2,8};
        for (int i = 0; i < N; i++) {
            tab[i] = tabData[i];
        }

        Arrays.sort(tab);

        for(int i : tab)
        System.out.println(i);


        
    }
}