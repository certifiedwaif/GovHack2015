exports.config = {
	domains: ["localstories.info"],
	pages: {
		"": "/homepage.html",
		"story": "/story.html",
		"random": "/demo.html"
	},
	services: {
		"requestjson": function (response, request, db, d){
			var d = d || randomGoodID();

			var query = "select * from tempview where row_names = "+d;
				db.query(query, function(error, results){	
					if(!error) {
						response.writeHead(200, {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*"
						});
						response.end(JSON.stringify(results[0]));
					} else {
						response.writeHead(200);
						response.end(error);
					}
				});

			function randomGoodID(){
				var ids = [
				1,2,6,10,11,12,13,14,16,17,20,22,23,25,27,28,29,30,31,32,33,35,36,40,41,42,43,45,46,47,49,50,51,52,53,54,55,58,59,60,61,62,63,65,67,68,69,70,71,72,74,76,80,81,84,85,86,87,88,89,92,28,94,95,96,98,99,100,101,102,103,104,105,106,107,110,112,113,115,116,117,118,119,121,122,123,124,126,127,128,129,130,131,133,134,135,142,143,144,145,147,148,153,154,156,157,159,161,162,163,164,165,166,167,168,170,171,172,173,174,175,176,179,180,181,182,184,185,186,187,188,190,194,196,198,202,205,209,210,211,212,214,216,217,218,219,221,222,223,224,226,227,231,232,233,234,236,237,238,239,241,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,261,262,264,265,266,267,269,270,271,273,274,276,277,224,151,278,279,280,283,285,286,289,290,291,292,293,294,295,296,297,298,299,300,304,305,306,308,309,310,312,313,314,315,316,320,321,322,323,325,326,327,328,330,331,332,333,334,337,339,342,345,349,352,353,356,360,361,362,364,365,366,542,311,373,374,376,377,379,381,385,386,387,390,391,392,393,395,396,397,398,399,401,402,405,406,408,409,414,417,418,420,421,422,423,424,426,427,428,430,433,435,437,438,439,442,445,446,447,448,449,452,453,454,455,456,457,459,542,461,462,463,467,468,470,471,472,473,475,476,480,481,482,484,489,490,491,492,494,495,496,498,499,500,501,502,503,504,505,506,507,508,509,510,511,512,514,515,517,518,519,520,521,523,524,525,526,527,528,531,532,533,534,536,538,540,541,543,544,545,546,549,491,490,711,550,551,552,554,555,556,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,573,574,575,576,578,579,580,581,582,584,585,586,587,588,589,591,592,594,596,597,598,599,601,602,603,606,607,608,613,614,615,619,620,621,622,623,624,626,627,628,629,632,633,634,635,636,637,711,638,639,640,644,645,646,647,775,651,652,653,655,657,660,661,662,664,665,666,668,669,670,671,672,675,677,678,679,680,682,684,685,686,688,689,690,691,692,693,694,696,697,698,699,703,704,706,707,708,710,715,716,718,721,723,725,727,728,729,647,775,731,732,733,734,735,736,737,738,740,742,743,744,745,746,748,749,750,751,752,753,754,755,757,758,759,761,763,766,767,768,770,771,772,773,774,776,777,778,779,781,783,784,786,789,790,791,792,793,795,796,797,799,800,801,802,803,804,805,808,809,810,811,812,813,815,816,818,819,820,822,823,886,881,824,826,829,830,831,832,833,835,838,841,842,844,845,847,848,849,850,852,853,854,855,856,857,877,858,859,860,862,866,868,869,872,873,875,857,877,880,881,882,884,885,886,888,889,890,894,896,898,900,901,903,907,910,911,912,913,914,916,917,918,919,920,922,924,925,926,927,929,930,931,933,934,935,938,942,945,946,949,950,951,953,954,956,957,958,959,960,961,962,963,964,965,966,967,969,970,971,972,973,974,975,976,977,979,980,981,984,985,986,987,988,989,990,991,992,993,994,996,997,1000,1001,1004,1006,1007,929,1005,1009,1010,1011,1012,1013,1014,1016,1017,1018,1019,1020,1023,1025,1026,1027,1073,1029,1030,1031,1034,1036,1040,1041,1042,1043,1044,1045,1046,1047,1048,1049,1050,1052,1053,1055,1059,1061,1065,1072,1027,1073,1078,1080,1081,1082,1083,1084,1085,1086,1085,1086,1087,1089,1088,1087,1089,1091,1094,1095,1099,1101,1104,1097,1098,1100,1103,1107,1108,1109,1110,1111,1112,1113,1206,1114,1116,1117,1119,1120,1121,1122,1123,1124,1154,1127,1128,1129,1130,1131,1133,1134,1137,1138,1139,1140,1142,1143,1144,1145,1146,1147,1150,1151,1152,1153,1124,1154,1155,1156,1159,1161,1162,1164,1165,1166,1167,1168,1169,1174,1175,1176,1178,1179,1182,1183,1185,1188,1189,1190,1192,1194,1113,1206,1128,1184,1187,1193,1195,1196,1197,1199,1200,1201,1203,1204,1205,1207,1208,1210,1211,1213,1216,1217,1219,1222,1223,1224,1226,1229,1231,1233,1235,1236,1237,1238,1239,1240,1241,1245,1246,1247,1248,1250,1251,1252,1253,1254,1256,1258,1259,1260,1265,1267,1268,1269,1270,1274,1275,1277,1278,1279,1282,1283,1336,1322,1261,1284,1285,1286,1287,1290,1292,1293,1294,1299,1300,1301,1302,1305,1306,1308,1309,1310,1311,1312,1313,1316,1317,1318,1319,1321,1322,1323,1326,1327,1328,1330,1332,1333,1335,1336,1337,1338,1339,1341,1344,1345,1347,1350,1351,1354,1355,1356,1357,1358,1359,1361,1362,1364,1365,1367,1368,1369,1370,1372,1375,1376,1379,1362,1346,1366,1378,1380,1381,1382,1385,1386,1387,1388,1391,1392,1393,1394,1395,1396,1398,1399,1401,1402,1403,1404,1405,1406,1407,1411,1412,1414,1416,1417,1419,1420,1422,1425,1426,1427,1429,1430,1431,1432,1433,1434,1435,1436,1437,1438,1439,1440,1441,1442,1443,1444,1445,1446,1447,1449,1450,1451,1454,1455,1456,1459,1461,1464,1465,1466,1467,1469,1453,1468,1470,1471,1472,1473,1474,1475,1476,1477,1478,1479,1480,1481,1482,1483,1484,1486,1487,1488,1489,1490,1491,1492,1493,1494,1495,1496,1497,1498,1499,1500,1503,1505,1506,1507,1508,1509,1510,1511,1512,1513,1514,1515,1516,1517,1518,1519,1520,1521,1522,1524,1525,1526,1527,1529,1530,1531,1533,1534,1535,1537,1538,1540,1542,1543,1546,1547,1548,1550,1551,1552,1553,1555,1556,1557,1558,1560,1561,1562,1563,1564,1565,1568,1571,1572,1573,1574,1575,1576,1577,1579,1581,1583,1586,1588,1590,1591,1592,1593,1594,1597,1598,1599,1600,1602,1603,1604,1606,1607,1608,1609,1610,1611,1613,1614,1615,1616,1617,1618,1619,1620,1621,1622,1623,1624,1625,1626,1628,1629,1630,1631,1632,1633,1636,1640,1641,1642,1643,1644,1645,1646,1651,1652,1653,1654,1656,1658,1647,1655,1657,1660,1663,1664,1666,1668,1669,1670,1671,1673,1674,1676,1677,1678,1679,1680,1681,1682,1684,1685,1686,1689,1690,1691,1692,1694,1695,1696,1697,1698,1699,1701,1702,1703,1705,1707,1709,1748,1750,1751,1752,1753,1763,1766,1767,1768,1782,1788,1791,1792,1794,1795,1796,1797,1798,1802,1807,1808,1810,1811,1812,1813,1814,1816,1818,1820,1821,1822,1823,1825,1827,1828,1829,1830,1831,1832,1835,1836,1837,1838,1841,1842,1846,1938,1834,1839,1840,1844,1845,1847,1848,1850,1852,1853,1857,1859,1860,1861,1863,1864,1869,1870,1871,1872,1873,1874,1875,1876,1877,1879,1882,1883,1884,1886,1889,1891,1892,1894,1895,1896,1898,1899,1900,1902,1903,1904,1905,1906,1907,1908,1913,1914,1915,1917,1918,1919,1920,1921,1922,1923,1924,1925,1926,1927,1928,1929,1931,1932,1933,1938,1934,1936,1939,1941,1942,1944,1946,1947,1948,1949,1953,1954,1955,1957,1958,1960,1961,1962,1963,1964,1965,1966,1968,1969,1970,1971,1973,1975,1977,1979,1981,1982,1983,1984,1985,1987,1988,1990,1991,1994,1995,1996,1998,1999,2001,2002,2003,2005,2007,2008,2009,2010,2012,2013,2015,2016,2018,2020,2023,2025,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2051,2052,2054,2055,2057,2058,2060,2061,2062,2063,2065,2068,2070,2071,2072,2073,2074,2075,2077,2078,2079,2080,2081,2082,2083,2084,2085,2086,2087,2088,2090,2093,2094,2095,2097,2098,2099,2100,2101,2102,2103,2104,2105,2106,2108,2111,2114,2116,2117,2119,2120,2121,2122,2123,2128,2129,2131,2132,2134,2135,2136,2138,2139,2140,2142,2143,2144,2146,2147,2149,2151,2152,2153,2154,2156,2158,2159,2160,2162,2163,2164,2163,2164,2165,2166,2167,2168,2170,2171,2172,2173,2174,2175,2176,2177,2178,2179,2180,2181,2183,2184,2185,2186,2187,2188,2189,2190,2194,2195,2196,2197,2200,2203,2205,2206,2208,2209,2211,2212,2213,2214,2215,2216,2218,2219,2220,2221,2222,2225,2226,2224,2228,2230,2232,2235,2236,2239,2240,2242,2244,2246,2247,2248,2249,2250,2252,2254,2258,2260,2261,2263,2264,2265,2267,2269,2270,2271,2272,2273,2274,2275,2277,2278,2282,2283,2284,2285,2286,2287,2289,2291,2292,2293,2294,2296,2300,2302,2303,2304,2305,2306,2308,2309,2311,2312,2313,2317,2319,2320,2321,2322,2323,2325,2327,2329,2332,2335,2337,2339,2340,2341,2342,2344,2346,2349,2351,2353,2355,2356,2357,2358,2359,2360,2361,2362,2363,2365,2368,2370,2371,2374,2376,2378,2381,2382,2383,2385,2386,2389,2390,2391,2393,2394,2396,2397,2398,2399,2400,2401,2402,2404,2405,2407,2408,2409,2410,2411,2412,2413,2415,2416,2418,2421,2422,2424,2426,2423,2427,2428,2429,2430,2431,2432,2433,2434,2436,2437,2438,2439,2440,2442,2444,2445,2447,2448,2449,2451,2453,2455,2458,2459,2461,2462,2463,2464,2466,2467,2468,2470,2471,2472,2473,2475,2477,2478,2480,2482,2483,2484,2486,2488,2491,2492,2494,2495,2496,2497,2498,2499,2500,2502,2503,2504,2505,2507,2508,2509,2510,2513,2514,2515,2516,2517,2522,2523,2525,2518,2521,2526,2527,2528,2531,2533,2534,2535,2537,2538,2539,2540,2541,2542,2544,2545,2547,2549,2550,2551,2552,2553,2555,2558,2559,2562,2563,2564,2565,2566,2567,2568,2570,2572,2573,2575,2576,2577,2578,2579,2581,2582,2583,2584,2585,2588,2589,2590,2592,2594,2596,2597,2598,2599,2600,2601,2602,2603,2604,2605,2606,2607,2608,2609,2610,2611,2612,2621,2618,2619,2620,2623,2624,2626,2628,2630,2631,2632,2633,2634,2635,2636,2637,2638,2642,2643,2644,2645,2646,2647,2649,2650,2651,2653,2655,2657,2659,2662,2663,2665,2669,2670,2671,2673,2675,2676,2677,2678,2679,2680,2681,2684,2685,2686,2688,2689,2690,2691,2692,2693,2696,2697,2698,2699,2700,2702,2703,2706,2707,2708,2710,2712,2713,2715,2716,2719,2718,2720,2722,2724,2725,2726,2727,2729,2730,2732,2735,2737,2738,2739,2740,2741,2743,2744,2745,2748,2749,2750,2752,2753,2755,2756,2757,2758,2759,2760,2762,2764,2765,2766,2768,2769,2770,2772,2773,2774,2779,2780,2781,2782,2783,2784,2783,2784,2785,2786,2787,2789,2790,2791,2792,2793,2794,2796,2797,2798,2802,2803,2806,2808,2810,2811,2812,2816,2818,2809,2817,2819,2821,2823,2824,2826,2828,2829,2830,2832,2833,2835,2837,2838,2841,2842,2843,2844,2846,2847,2848,2849,2850,2851,2852,2853,2854,2855,2857,2859,2860,2862,2863,2864,2866,2867,2868,2869,2871,2872,2874,2875,2877,2878,2879,2880,2881,2882,2883,2884,2885,2886,2889,2890,2892,2893,2894,2895,2896,2897,2898,2899,2900,2901,2903,2904,2906,2908,2909,2911,2917,2913,2914,2919,2920,2922,2925,2927];
				var bad = [
				162,176,177,188,193,206,230,319,341,367,368,371,375,383,415,417,478,529,552,604,605,687,726,905,922,1002,1031,1041,1058,1062,1064,1069,1074,1076,1080,1102,1122,1125,1158,1171,1209,1212,1214,1227,1235,1249,1291,1325,1348,1545,1595,1637,1638,1648,1713,1715,1718,1720,1724,1725,1729,1732,1734,1735,1736,1740,1743,1745,1757,1758,1772,1773,1775,1776,1777,1778,1781,1783,1784,1785,1805,1806,1821,1945,2115,2176,2270,2300,2325,2493,2517,2755,2830,2873,2926];

				var number = ids[Math.floor(Math.random() * ids.length)];
	
				if(bad.indexOf(number) != -1) {
					number = randomGoodID();
				}
				return number;
			}
		}
	}
};

















