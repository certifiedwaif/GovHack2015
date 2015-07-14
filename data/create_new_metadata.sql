create table metadata_common (
	Primary_image text not null,
	keywords text not null,
	description text not null,
	viewport text not null,
	language text not null,
	ABC_region text not null,
	DCSext_LocalRegion text not null,
	google_site_verification text not null,
	title text not null,
	DC_title text not null,
	DC_description text not null,
	DC_coverage_postcode text not null,
	DC_creator_CorporateName text not null,
	DC_publisher_CorporateName text not null,
	DC_rightsHolder text not null,
	DC_type text not null,
	DCTERMS_spatial text not null,
	ABC_structuralGenre text not null,
	ABC_site text not null,
	ABC_editorialGenre text not null,
	ICBM text not null,
	geo_position text not null
);

CREATE INDEX metadata_common_names ON metadata_common (Primary_image(57));
CREATE INDEX metadata_names ON metadata (`Primary.image`(57));

insert into metadata_common(Primary_image)
select distinct `Primary.image`
from metadata;

update metadata_common c, metadata m
set c.keywords=m.content
where c.Primary_image=m.`Primary.image`
and m.name='keywords';

update metadata_common c, metadata m
set c.description=m.content
where c.Primary_image=m.`Primary.image`
and m.name='description';

-- viewport
update metadata_common c, metadata m
set c.viewport=m.content
where c.Primary_image=m.`Primary.image`
and m.name='viewport';
-- language
update metadata_common c, metadata m
set c.language=m.content
where c.Primary_image=m.`Primary.image`
and m.name='language';

-- ABC_region
update metadata_common c, metadata m
set c.ABC_region=m.content
where c.Primary_image=m.`Primary.image`
and m.name='ABC.region';

-- DCSext_LocalRegion
update metadata_common c, metadata m
set c.DCSext_LocalRegion=m.content
where c.Primary_image=m.`Primary.image`
and m.name='DCSext.LocalRegion';

-- google_site_verification
update metadata_common c, metadata m
set c.google_site_verification=m.content
where c.Primary_image=m.`Primary.image`
and m.name='google-site-verification';

-- title
update metadata_common c, metadata m
set c.title=m.content
where c.Primary_image=m.`Primary.image`
and m.name='title';

-- DC_title
update metadata_common c, metadata m
set c.DC_title=m.content
where c.Primary_image=m.`Primary.image`
and m.name='DC.title';

-- DC_description
update metadata_common c, metadata m
set c.DC_description=m.content
where c.Primary_image=m.`Primary.image`
and m.name='DC.description';

-- DC_coverage_postcode
update metadata_common c, metadata m
set c.DC_coverage_postcode=m.content
where c.Primary_image=m.`Primary.image`
and m.name='DC.coverage.postcode';

-- DC_creator_CorporateName
update metadata_common c, metadata m
set c.DC_creator_CorporateName=m.content
where c.Primary_image=m.`Primary.image`
and m.name='DC.creator.CorporateName';

-- DC_publisher_CorporateName
update metadata_common c, metadata m
set c.DC_publisher_CorporateName=m.content
where c.Primary_image=m.`Primary.image`
and m.name='DC.publisher.CorporateName';

-- DC_rightsHolder
update metadata_common c, metadata m
set c.DC_rightsHolder=m.content
where c.Primary_image=m.`Primary.image`
and m.name='DC.rightsHolder';

-- DC_type
update metadata_common c, metadata m
set c.DC_type=m.content
where c.Primary_image=m.`Primary.image`
and m.name='DC.type';

-- DCTERMS_spatial
update metadata_common c, metadata m
set c.DCTERMS_spatial=m.content
where c.Primary_image=m.`Primary.image`
and m.name='DCTERMS.spatial';

-- ABC_structuralGenre
update metadata_common c, metadata m
set c.ABC_structuralGenre=m.content
where c.Primary_image=m.`Primary.image`
and m.name='ABC.structuralGenre';

-- ABC_site
update metadata_common c, metadata m
set c.ABC_site=m.content
where c.Primary_image=m.`Primary.image`
and m.name='ABC.site';

-- ABC_editorialGenre
update metadata_common c, metadata m
set c.ABC_editorialGenre=m.content
where c.Primary_image=m.`Primary.image`
and m.name='ABC.editorialGenre';

-- ICBM
update metadata_common c, metadata m
set c.ICBM=m.content
where c.Primary_image=m.`Primary.image`
and m.name='ICBM';

/* geo_position */
update metadata_common c, metadata m
set c.geo_position=m.content
where c.Primary_image=m.`Primary.image`
and m.name='geo.position';
