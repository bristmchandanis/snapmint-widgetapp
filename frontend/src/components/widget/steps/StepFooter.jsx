import React from 'react';
import PropTypes from 'prop-types';
import { Button, Stack, Box, Divider } from '../../ui';

export default function StepFooter({
  onBack,
  onNext,
  nextLabel = 'Next',
  isNextDisabled = false,
  loading = false,
  showBack = true,
}) {
  return (
    <Stack gap="base">
      <Divider />
      <Stack direction="inline" justifyContent="space-between" alignItems="center">
        {showBack ? (
          <Button variant="secondary" onClick={onBack} disabled={loading}>
            Back
          </Button>
        ) : (
          <Box />
        )}

        <Button
          variant="primary"
          disabled={isNextDisabled || loading}
          loading={loading ? true : undefined}
          onClick={onNext}
        >
          {nextLabel}
        </Button>
      </Stack>
    </Stack>
  );
}

StepFooter.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func.isRequired,
  nextLabel: PropTypes.string,
  isNextDisabled: PropTypes.bool,
  loading: PropTypes.bool,
  showBack: PropTypes.bool,
};
