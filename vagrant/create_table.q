ADD JAR /vagrant/json-serde-1.3.1.jar;

DROP TABLE IF EXISTS tweets;

CREATE EXTERNAL TABLE IF NOT EXISTS tweets (
	datetime	BIGINT,
	id		STRING,
	text		STRING,
	latitude	DOUBLE,
	longitude	DOUBLE,
	user		STRING,
	name		STRING)

	ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
	LOCATION '/tmp/tweets';
