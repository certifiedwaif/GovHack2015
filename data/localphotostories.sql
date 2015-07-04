create table localphotostories (
	Title as varchar,
	URL as varchar,
	Date as date,
	Primary.image as varchar,
	Primary.image.caption as varchar,
	Primary.image.rights.information as varchar,
	Subjects as varchar,
	Station as varchar,
	State as varchar,
	Place as varchar,
	Keywords as varchar,
	Latitude as float,
	Longitude as float,
	MediaRSS.URL as varchar
);