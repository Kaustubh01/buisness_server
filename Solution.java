import java.util.*;
import java.lang.*;
import java.io.*;

/*
 * 
 */
public class Solution
{
	public static int  workingWeeks(int[] projC)
	{
		int totalModules = 0;
		int maxModules = 0;

		for(int modules: projC){
			totalModules += modules;
			maxModules = Math.max(maxModules, modules);
		}

		int remainingModules = totalModules - maxModules;

		if(maxModules > remainingModules+1){
			return 2*remainingModules+1;
		}else{
			return totalModules;
		}

	}

	public static int  maxRatingBooks(int amount, int[][] horrorBooks, int[][] sciFiBooks){
		int maxRating = -1;
		int n = horrorBooks.length;
		int m = sciFiBooks.length;

		for(int i=0; i<n; i++){
			for(int j=0; j<m; j++){
				if(horrorBooks[i][1] + sciFiBooks[j][1] <= amount){
					maxRating = Math.max(maxRating, horrorBooks[i][0] + sciFiBooks[j][0]);
				}
			}
		}

		return maxRating;
	}

	}


	public static void main(String[] args)
	{
		Scanner in = new Scanner(System.in);
		//input for projC
		int projC_size = in.nextInt();
		int projC[] = new int[projC_size];
		for(int idx = 0; idx < projC_size; idx++)
		{
			projC[idx] = in.nextInt();
		}
		
		int result = workingWeeks(projC);
		System.out.print(result);
		
	}
}
