/**
 * Created by erikccoder on 5/7/2018.
 */

var Table = function ()
{
	this.groups = ["Tencent","Baidu", "Alibaba"].map( g => g.toLowerCase());

	this.group_companies = {};


	this.filters = {};
}

Table.prototype.init = function ()
{
	this.initGroupCompanies();
	this.initFilter();
}

Table.prototype.initFilter = function ()
{

	var all_industries = _.uniq(table_data.map( d => _.get(d, "Industry") ).filter(d => d != null));
	var all_sectors = _.uniq(table_data.map( d => _.get(d, "Sector") ).filter(d => d != null));
	var all_types = _.uniq(table_data.map( d => _.get(d, "Build or Invest") ).filter(d => d != null));
	var all_geo = _.uniq(table_data.map( d => _.get(d, "Inside or Outside of Mainland China") ).filter(d => d != null));

	$("#by-industry").html(
		"<option value='all'>All</option>"
		+ all_industries.map( i => `<option value='${i}'>${i}</option>`)
	)

	$("#by-geo").html(
		"<option value='all'>All</option>"
		+ all_geo.map( i => `<option value='${i}'>${i}</option>`)
	)

	$("#by-sector").html(
		"<option value='all'>All</option>"
		+ all_sectors.map( i => `<option value='${i}'>${i}</option>`)
	)

	$("#by-type").html(
		"<option value='all'>All</option>"
		+ all_types.map( i => `<option value='${i}'>${i}</option>`)
	)

	$("#by-industry, #by-geo, #by-sector, #by-type").on("change", this.filterUpdated.bind(this))
}

Table.prototype.updateSectionFilter = function()
{
	const has_industry = _.has(this.filters, "Industry");

	var all_sectors = _.uniq(
		table_data.map( d => {

			if(has_industry && _.get(d, "Industry") != _.get(this.filters, "Industry"))
			{
				return null;
			}

			return _.get(d, "Sector")
		})
		.filter(d => d != null)
	);

	

	$("#by-sector").html(
		"<option value='all'>All</option>"
		+ all_sectors.map( i => `<option value='${i}'>${i}</option>`)
	)

}

Table.prototype.filterUpdated = function (e)
{
	var filter_id = e.target.id;
	var filter_value = e.target.value;
	var filter_key = "";


	const old_has_industry = _.has(this.filters, "Industry");
	const old_industry_value = _.get(this.filters, "Industry");

	switch (filter_id)
	{
		case "by-industry":
			filter_key = "Industry";
			this.filters = _.omit(this.filters, "Sector");
			break;

		case "by-geo":
			filter_key = "Inside or Outside of Mainland China";
			break;

		case "by-sector":
			filter_key = "Sector";
			break;

		case "by-type":
			filter_key = "Build or Invest";
			break;

	}

	if(filter_value == 'all')
	{
		this.filters = _.omit(this.filters, filter_key)

	}
	else
	{
		_.set( this.filters, filter_key, filter_value );
	}

	const new_has_industry = _.has(this.filters, "Industry");
	const new_industry_value = _.get(this.filters, "Industry");
	if(// old_has_industry != new_has_industry
		new_has_industry || old_has_industry
	)
	{
		// console.log(old_industry_value, new_industry_value);
		
		if(old_industry_value != new_industry_value)
		{
			this.updateSectionFilter();
		}
	}

	this.updateTable();
}

Table.prototype.updateTable = function ()
{
	this.groups.forEach( grp =>
	{
		var html = "";//`${this.group_companies[grp].length}`;

		var filter_list;

		if(Object.keys(this.filters).length)
		{
			filter_list = _.filter(this.group_companies[grp], this.filters);
			filter_list = _.sortBy(filter_list, ["num_inves", "Name of Company"]);
		}
		else
		{
			filter_list = this.group_companies[grp];
		}



		filter_list.forEach( comp =>
		{


			html +=
`
<p class="company">${comp["Name of Company"]}</p>
`
		})

		$(`#${grp} .companies`).html(html)
	})

}

Table.prototype.initGroupCompanies = function ()
{

	table_data.forEach( (c,i) =>
	{
		const c_name = _.get(c, "Name of Company");
		const multi_inves = _.find(table_data_multi_investors_companies, {"Name of Company": c_name})

		_.set(table_data, `${i}.num_inves`, _.get(multi_inves, "Number of investors", 1)*-1)
	})

	this.groups.forEach( grp =>
	{
		this.group_companies[grp] = table_data.filter( c => c["Owner"].toLowerCase() == grp.toLowerCase() )
		// this.group_companies[grp].sort( (a,b) => ('' + a["Name of Company"]).localeCompare(b["Name of Company"]) )
		this.group_companies[grp] = _.sortBy(this.group_companies[grp], ['Name of Company']);

	})

	// console.log(this.group_companies);

	this.updateTable();
}