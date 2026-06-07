import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Internal component imports omitted — proprietary
// import DashboardLayout from '...';
// import { ArchetypeTabs } from '...';

// Helper functions omitted — proprietary
// import { mergeArchetypeWithCountyData, calculateEmissionsContribution, calculateStateAverages } from '...';

// Config imports omitted — proprietary
// import { getFullPlaceName, getProject } from '...';

/**
 * ArchetypesContent
 * Renders the household profiles dashboard for a given geography.
 * Handles empty state, cluster count selection, and passes derived data to tabs.
 */
function ArchetypesContent({
  stateArchetypes,
  countyDistribution,
  pumaArchetypes,
  mergedArchetypes,
  stateAverages,
  contributionData,
  placeName,
  year,
  sectorColors,
  fontFace,
  geoType,
  state,
  selectedClusterCount,
  availableClusterCounts,
  onClusterCountChange
}) {
  if (!stateArchetypes || stateArchetypes.length === 0) {
    return (
      <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 4 }}>
        <Alert severity="info">
          Archetype data is not yet available for this location.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      {/* Page header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          component="h1"
          variant="h4"
          color="text.primary"
          sx={{ fontWeight: 600, mb: 1 }}
        >
          Household Profiles
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: '700px', mx: 'auto', mb: 3 }}
        >
          Understand the composition of households in {placeName} and how different
          household types contribute to consumption-based emissions.
        </Typography>

        {/* Cluster count selector — switches between pre-fetched profile configurations */}
        {availableClusterCounts && availableClusterCounts.length > 1 && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="cluster-count-label">Number of Profiles</InputLabel>
            <Select
              labelId="cluster-count-label"
              id="cluster-count-select"
              value={selectedClusterCount}
              label="Number of Profiles"
              onChange={(e) => onClusterCountChange(e.target.value)}
            >
              {availableClusterCounts.map((count) => (
                <MenuItem key={count} value={count}>
                  {count} Profiles
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Tabbed views — Overview, Impact, Drivers, PUMA Breakdown */}
      {/* <ArchetypeTabs ... /> omitted — proprietary */}
    </Box>
  );
}

/**
 * Archetypes (page component)
 *
 * Key decisions:
 * - All cluster configurations pre-fetched at build time (getStaticProps),
 *   so switching profiles is instant client-side with no additional requests.
 * - Derived data (mergedArchetypes, stateAverages, contributionData) computed
 *   via useMemo, keyed on selectedClusterCount — avoids redundant recalculation.
 * - Geography is fully parameterized — no hardcoded counties or states.
 */
export default function Archetypes(props) {
  const { archetypes, location, stateAbbv, geoid, geoType } = props;

  // Resolve display name from location param (implementation omitted — proprietary)
  const placeName = location
    ? location.charAt(0).toUpperCase() + location.slice(1)
    : '';

  // Project-level config (colors, viewport, fonts) — omitted
  // const [sectorColors, project, DEFAULT_VIEWPORT, fontFace] = getProject(geoid);

  // Cluster config — multiple profile counts supported
  const byClusterCount = archetypes?.byClusterCount || {};
  const availableClusterCounts = archetypes?.availableClusterCounts || [];
  const defaultClusterCount = archetypes?.defaultClusterCount || 5;
  const year = archetypes?.year || 2022;
  const state = archetypes?.state || stateAbbv;

  const [selectedClusterCount, setSelectedClusterCount] = useState(defaultClusterCount);

  // Pull data for currently selected cluster count
  const selectedData = byClusterCount[selectedClusterCount] || {
    archetypes: archetypes?.archetypes || [],
    countyDistribution: archetypes?.countyDistribution || null,
    pumaArchetypes: archetypes?.pumaArchetypes || null
  };

  const stateArchetypes = selectedData.archetypes || [];
  const countyDistribution = selectedData.countyDistribution || null;
  const pumaArchetypes = selectedData.pumaArchetypes || null;

  // Derived data — recomputes only when cluster selection or source data changes
  const { mergedArchetypes, stateAverages, contributionData } = useMemo(() => {
    if (!stateArchetypes || stateArchetypes.length === 0) {
      return { mergedArchetypes: [], stateAverages: {}, contributionData: null };
    }

    // Merge state archetype profiles with county-level distribution data
    // const merged = mergeArchetypeWithCountyData(stateArchetypes, countyDistribution);

    // Compute state-level averages for benchmarking
    // const averages = calculateStateAverages(stateArchetypes);

    // Compute total emissions contribution per profile (count × per-household emissions)
    // const contribution = calculateEmissionsContribution(merged);

    return {
      mergedArchetypes: [],   // merged
      stateAverages: {},      // averages
      contributionData: null  // contribution
    };
  }, [stateArchetypes, countyDistribution, selectedClusterCount]);

  const handleClusterCountChange = (newCount) => {
    setSelectedClusterCount(Number(newCount));
  };

  return (
    // DashboardLayout omitted — proprietary
    <ArchetypesContent
      stateArchetypes={stateArchetypes}
      countyDistribution={countyDistribution}
      pumaArchetypes={pumaArchetypes}
      mergedArchetypes={mergedArchetypes}
      stateAverages={stateAverages}
      contributionData={contributionData}
      placeName={placeName}
      year={year}
      geoType={geoType}
      state={state}
      selectedClusterCount={selectedClusterCount}
      availableClusterCounts={availableClusterCounts}
      onClusterCountChange={handleClusterCountChange}
    />
  );
}

/**
 * getStaticPaths — generates paths for all supported geographies at build time.
 * Geography list omitted — proprietary config.
 */
export async function getStaticPaths() {
  // const paths = unlockedPaths.map(p => p + '/archetypes');
  return {
    paths: [],
    fallback: false
  };
}

/**
 * getStaticProps — fetches all cluster configurations for this geography at build time.
 * Proprietary data fetching logic omitted.
 */
export async function getStaticProps({ params }) {
  // return await getCBEIPageStaticPropsV2(params, { getArchetypes: true });
  return { props: {} };
}
