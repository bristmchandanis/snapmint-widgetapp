import { Section, Stack, Text, Button, Spinner } from '../ui';

const TONE_MAP = {
  PDP: 'success',
  COLLECTION: 'info',
  CART: 'warning',
  MINICART: 'caution',
  CARTDRAWER: 'magic',
};

const extractWidgetInfo = (widget) => {
  const minNum = Number(widget.minAmount ?? widget.min_amount ?? 0);
  const maxNum = Number(widget.maxAmount ?? widget.max_amount ?? 0);

  const priceRange = (minNum > 0 || maxNum > 0)
    ? `₹${minNum.toLocaleString('en-IN')} – ₹${maxNum.toLocaleString('en-IN')}`
    : 'All Ranges';

  const isActive = widget.isActive !== false && widget.is_active !== false;

  return { priceRange, isActive };
};

export default function WidgetCustomizationTable({
  widgets = [],
  loading = false,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <Section>
        <Stack
          alignItems="center"
          justifyContent="center"
          padding="large-400"
          minBlockSize="160px"
        >
          <Spinner />
        </Stack>
      </Section>
    );
  }

  if (widgets.length === 0) {
    return (
      <Section>
        <Stack
          alignItems="center"
          justifyContent="center"
          padding="large-400"
          minBlockSize="160px"
        >
          <Text color="subdued">No widget customizations found</Text>
        </Stack>
      </Section>
    );
  }

  return (
    <s-table>
      <s-table-header-row>
        <s-table-header listSlot="primary">Master Layout</s-table-header>
        <s-table-header>Price Range</s-table-header>
        <s-table-header>Placements</s-table-header>
        <s-table-header>Status</s-table-header>
        <s-table-header>Created Date</s-table-header>
        <s-table-header listSlot="secondary">
          <Stack direction="inline" justifyContent="end">
            Actions
          </Stack>
        </s-table-header>
      </s-table-header-row>

      <s-table-body>
        {widgets.map((widget) => {
          const { priceRange, isActive } = extractWidgetInfo(widget);

          return (
            <s-table-row key={widget.id}>
              <s-table-cell>
                {widget.masterTemplateLayout || 'N/A'}
              </s-table-cell>
              <s-table-cell>
                {priceRange}
              </s-table-cell>
              <s-table-cell>
                {Array.isArray(widget.placements) ? (
                  <Stack gap="small-300" direction="inline" wrap={true}>
                    {widget.placements.map((placement, index) => (
                      <s-badge key={index} tone={TONE_MAP[placement] || 'neutral'}>
                        {placement}
                      </s-badge>
                    ))}
                  </Stack>
                ) : widget.placements ? (
                  <s-badge tone={TONE_MAP[widget.placements] || 'neutral'}>
                    {widget.placements}
                  </s-badge>
                ) : (
                  'N/A'
                )}
              </s-table-cell>
              <s-table-cell>
                <s-badge tone={isActive ? 'success' : 'neutral'}>
                  {isActive ? 'Active' : 'Inactive'}
                </s-badge>
              </s-table-cell>
              <s-table-cell>
                {widget.createdAt
                  ? new Date(widget.createdAt).toLocaleDateString()
                  : 'N/A'}
              </s-table-cell>
              <s-table-cell>
                <Stack
                  gap="small-300"
                  direction="inline"
                  wrap={false}
                  justifyContent="end"
                >
                  <Button
                    icon="edit"
                    size="slim"
                    disabled={loading}
                    onClick={() => onEdit?.(widget)}
                  />
                  <Button
                    icon="delete"
                    variant="primary"
                    tone="critical"
                    size="slim"
                    disabled={loading}
                    command="--show"
                    commandFor="delete-widget-modal"
                    onClick={() => onDelete?.(widget)}
                  />
                </Stack>
              </s-table-cell>
            </s-table-row>
          );
        })}
      </s-table-body>
    </s-table>
  );
}
