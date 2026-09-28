import { Section, Stack, Grid, Clickable, Switch, Banner, Text } from '../../ui';
import StepFooter from './StepFooter';

const LOCATIONS = [
  { id: 'displayPdp', code: 'PDP', label: 'PDP', desc: 'Product page near buy button' },
  { id: 'displayCollection', code: 'COLLECTION', label: 'Collection', desc: 'Product grid item cards section' },
  { id: 'displayCart', code: 'CART', label: 'Cart Page', desc: 'Cart page subtotal section' },
  { id: 'displayMiniCart', code: 'MINICART', label: 'Mini Cart', desc: 'Popup mini cart dropdown' },
  { id: 'displayCartDrawer', code: 'CARTDRAWER', label: 'Cart Drawer', desc: 'Slide-out cart drawer footer' },
];

export default function StepLocations({ config, onChangeConfig, onNext, onBack }) {
  const toggleLocation = ({ id, code }) => {
    const nextVal = !config?.[id];
    const prevPlacements = config?.placements || ['PDP'];
    const placements = nextVal
      ? [...new Set([...prevPlacements, code])]
      : prevPlacements.filter((placement) => placement !== code);

    onChangeConfig({ ...config, [id]: nextVal, placements });
  };

  const hasAnyPlacement = LOCATIONS.some((location) => config?.[location.id] || config?.placements?.includes(location.code));

  return (
    <Section heading="Placements">
      <Stack gap="base">
        <Text color="subdued">Choose where you want the widget to appear.</Text>

        <Grid gridTemplateColumns="repeat(auto-fit, minmax(130px, 1fr))" gap="small-200" alignItems="stretch">
          {LOCATIONS.map((location) => {
            const checked = Boolean(config?.[location.id] ?? config?.placements?.includes(location.code));

            return (
              <Clickable
                key={location.id}
                border="base"
                borderRadius="base"
                padding="small-200"
                background={checked ? "subdued" : "transparent"}
                borderColor={checked ? "strong" : "subdued"}
                onClick={() => toggleLocation(location)}
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100%' }}
              >
                <Stack gap="small-100" blockAlignment="start">
                  <Stack direction="inline" justifyContent="space-between" alignItems="center">
                    <Text color="base" type="strong" size="small">{location.label}</Text>
                    <div style={{ pointerEvents: 'none' }}>
                      <Switch id={location.id} name={location.id} checked={checked} />
                    </div>
                  </Stack>
                  <Text color="subdued" size="small">{location.desc}</Text>
                </Stack>
              </Clickable>
            );
          })}
        </Grid>

        {!hasAnyPlacement && (
          <Banner tone="warning">
            <Text>Please select at least one placement location to proceed.</Text>
          </Banner>
        )}

        <StepFooter onBack={onBack} onNext={onNext} isNextDisabled={!hasAnyPlacement} />
      </Stack>
    </Section>
  );
}
