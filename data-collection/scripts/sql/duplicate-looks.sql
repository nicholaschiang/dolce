  SELECT ARRAY_AGG("id") "id", MIN("id") "idmin"
	FROM "Look"
	GROUP BY "showId", "number"
	HAVING COUNT(*) > 1;
  
 	SELECT ARRAY_AGG("id") "id", "showId", "number", COUNT(*)
	FROM "Look"
	GROUP BY "showId", "number"
	HAVING COUNT(*) > 1;
