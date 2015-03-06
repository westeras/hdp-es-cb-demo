DROP TABLE IF EXISTS tweets;

CREATE EXTERNAL TABLE IF NOT EXISTS tweets (
	id		STRING,
	text		STRING,
	name		STRING,
	longitude	STRING,
	latitude	STRING,
	datetime	STRING,
	user		STRING)

	ROW FORMAT SERDE 'org.apache.hive.hcatalog.data.JsonSerDe'
	LOCATION '/tmp/tweets';

