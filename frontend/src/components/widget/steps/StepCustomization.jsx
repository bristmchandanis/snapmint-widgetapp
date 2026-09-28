import { Section, Stack, Text, TextField, Box, Grid, GridItem, ColorField } from '../../ui';
import TemplatePreview from '../TemplatePreviews';
import StepFooter from './StepFooter';

export default function StepCustomization({
  config,
  onChangeConfig,
  masterTemplateId = 'master_1',
  onSaveConfig,
  saving = false,
  onBack,
}) {
  const convertLogoUrlToBase64 = async () => {
    const logoUrl = config?.logoUrl?.trim();
    if (!logoUrl || logoUrl.startsWith('data:')) return;

    try {
      const response = await fetch(logoUrl);
      if (!response.ok) throw new Error(`Could not download image (${response.status})`);

      const imageBlob = await response.blob();
      if (!imageBlob.type.startsWith('image/')) {
        throw new Error('The URL does not point to an image');
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onChangeConfig({ ...config, logoUrl: reader.result });
      };
      reader.readAsDataURL(imageBlob);
    } catch (error) {
      console.warn('Unable to convert logo URL to Base64:', error.message);
    }
  };

  const handleTextChange = (field) => (event) => {
    const value = typeof event === 'string'
      ? event
      : (event?.detail?.value ?? event?.target?.value ?? event?.value ?? '');
    onChangeConfig({ ...config, [field]: value });
  };

  return (
    <Section heading="Customization">
      <Stack gap="base">
        <Grid gridTemplateColumns="1.1fr 0.9fr" gap="base">
          {/* LEFT COLUMN: Content & Color Customization */}
          <Stack direction="vertical" gap="base">
            {/* Section 1: Content Customization */}
            <Box padding="base" border="base" borderRadius="base" background="base">
              <Stack gap="base">
                <Text variant="headingMd" as="h3">Content Customization</Text>
                <Grid gridTemplateColumns="1fr 1fr" gap="base">
                  <TextField
                    label="Header Logo Icon URL"
                    placeholder="https://example.com/logo.png"
                    value={config?.logoUrl ?? ''}
                    onInput={handleTextChange('logoUrl')}
                    onChange={handleTextChange('logoUrl')}
                    onBlur={convertLogoUrlToBase64}
                  />
                  <TextField
                    label="Header Title"
                    placeholder="e.g. Pay Later"
                    value={config?.titleText ?? 'Pay Later'}
                    onInput={handleTextChange('titleText')}
                    onChange={handleTextChange('titleText')}
                  />
                  <Box>
                    <TextField
                      label="Pay Note / Downpayment Text"
                      placeholder="e.g. Pay only ₹{amount} Now"
                      value={config?.buttonText ?? 'Pay only ₹{amount} Now'}
                      onInput={handleTextChange('buttonText')}
                      onChange={handleTextChange('buttonText')}
                    />
                    <Text color="subdued" as="p" style={{ fontSize: '11px', marginTop: '4px' }}>
                      Use {'{amount}'} for dynamic amount
                    </Text>
                  </Box>
                  <TextField
                    label="Pay Text"
                    placeholder="e.g. Pay Now"
                    value={config?.step1Text ?? ''}
                    onInput={handleTextChange('step1Text')}
                    onChange={handleTextChange('step1Text')}
                  />
                  <TextField
                    label="Subtitle / EMI Note"
                    placeholder="e.g. & pay the rest in No Cost EMIs"
                    value={config?.badgeText ?? ''}
                    onInput={handleTextChange('badgeText')}
                    onChange={handleTextChange('badgeText')}
                  />
                  <TextField
                    label="Feature Callout 1"
                    placeholder="e.g. 0% Interest Installments"
                    value={config?.feature1Text ?? '0% Interest Installments'}
                    onInput={handleTextChange('feature1Text')}
                    onChange={handleTextChange('feature1Text')}
                  />
                  <TextField
                    label="Feature Callout 2"
                    placeholder="e.g. 0 Extra Cost"
                    value={config?.feature2Text ?? '0 Extra Cost'}
                    onInput={handleTextChange('feature2Text')}
                    onChange={handleTextChange('feature2Text')}
                  />
                  <TextField
                    label="Feature Callout 3"
                    placeholder="e.g. UPI & Cards accepted"
                    value={config?.feature3Text ?? 'UPI & Cards accepted'}
                    onInput={handleTextChange('feature3Text')}
                    onChange={handleTextChange('feature3Text')}
                  />
                  <GridItem gridColumn="span 2">
                    <TextField
                      label="Footer Instruction Text"
                      placeholder="e.g. Select Merchant Pay Later during checkout"
                      value={config?.footerText ?? ''}
                      onInput={handleTextChange('footerText')}
                      onChange={handleTextChange('footerText')}
                    />
                  </GridItem>
                </Grid>
              </Stack>
            </Box>

            {/* Section 2: Color & Styling Customization */}
            <Box padding="base" border="base" borderRadius="base" background="base">
              <Stack gap="base">
                <Text variant="headingMd" as="h3">Apply Color & Styling</Text>
                <Grid gridTemplateColumns="1fr 1fr" gap="base">
                  <ColorField
                    label="Header Title Color"
                    value={config?.titleColor || '#111827'}
                    onInput={handleTextChange('titleColor')}
                    onChange={handleTextChange('titleColor')}
                  />
                  <ColorField
                    label="Pay Now Text Color"
                    value={config?.buttonTextColor || '#111827'}
                    onInput={handleTextChange('buttonTextColor')}
                    onChange={handleTextChange('buttonTextColor')}
                  />
                  <ColorField
                    label="Subtitle Color"
                    value={config?.badgeColor || '#4b5563'}
                    onInput={handleTextChange('badgeColor')}
                    onChange={handleTextChange('badgeColor')}
                  />
                  <ColorField
                    label="Feature Callouts Color"
                    value={config?.featureTextColor || '#6b7280'}
                    onInput={handleTextChange('featureTextColor')}
                    onChange={handleTextChange('featureTextColor')}
                  />
                  <ColorField
                    label="Modal Background"
                    value={config?.backgroundColor || '#ffffff'}
                    onInput={handleTextChange('backgroundColor')}
                    onChange={handleTextChange('backgroundColor')}
                  />
                  <ColorField
                    label="Modal Border Color"
                    value={config?.borderColor || '#e5e7eb'}
                    onInput={handleTextChange('borderColor')}
                    onChange={handleTextChange('borderColor')}
                  />
                  <ColorField
                    label="Footer Background"
                    value={config?.footerBgColor || '#f9fafb'}
                    onInput={handleTextChange('footerBgColor')}
                    onChange={handleTextChange('footerBgColor')}
                  />
                  <ColorField
                    label="Footer Text Color"
                    value={config?.footerTextColor || '#374151'}
                    onInput={handleTextChange('footerTextColor')}
                    onChange={handleTextChange('footerTextColor')}
                  />
                </Grid>
              </Stack>
            </Box>
          </Stack>

          {/* RIGHT COLUMN: Live Interactive Widget Preview */}
          <Box>
            <Box style={{ position: 'sticky', top: '24px' }}>
              <Box padding="base" border="base" borderRadius="base" background="base">
                <Stack gap="base">
                  <Text variant="headingMd" as="h3">Live Layout Preview</Text>
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f9fafb',
                      minHeight: '480px',
                      padding: '16px',
                      borderRadius: '12px',
                    }}
                  >
                    <TemplatePreview
                      templateId={masterTemplateId}
                      sampleAmount={3000}
                      {...config}
                    />
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Step Footer integrated inside the same card */}
        <StepFooter
          onBack={onBack}
          onNext={onSaveConfig}
          nextLabel={saving ? 'Saving' : 'Save Widget'}
          loading={saving}
        />
      </Stack>
    </Section>
  );
}
