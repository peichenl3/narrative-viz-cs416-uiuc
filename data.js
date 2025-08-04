// data.js
export async function loadData() {
  // helper to strip $ and commas, then parse to float
  const parseNum = s => {
    if (typeof s !== "string") return NaN;
    return parseFloat(s.replace(/\$/g, "").replace(/,/g, ""));
  };

  // load & parse each row manually
  const raw = await d3.csv("country2023.csv", d => {
    const gdp        = parseNum(d["GDP"]);
    const population = parseNum(d["Population"]);
    const labor      = parseNum(d["Population: Labor force participation (%)"]);
    const fertility  = parseNum(d["Fertility Rate"]);
    const life       = parseNum(d["Life expectancy"]);

    return {
      country:    d["Country"],
      gdp,
      population,
      labor,
      fertility,
      life,
      gdpPerCapita: population > 0 ? gdp / population : NaN
    };
  });

  // filter out any rows where parsing failed
  const data = raw.filter(d =>
    !isNaN(d.gdp) &&
    !isNaN(d.population) &&
    !isNaN(d.labor) &&
    !isNaN(d.fertility) &&
    !isNaN(d.life)
  );

  console.log("Loaded", data.length, "countries", data.slice(0,5));
  return data;
}
