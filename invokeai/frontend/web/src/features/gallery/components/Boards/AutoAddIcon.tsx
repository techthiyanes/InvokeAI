import { Badge, Flex } from '@chakra-ui/react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

const AutoAddIcon = () => {
  const { t } = useTranslation();
  return (
    <Flex position="absolute" insetInlineEnd={0} top={0} p={1}>
      <Badge variant="solid" bg="blue.500">
        {t('common.auto')}
      </Badge>
    </Flex>
  );
};

export default memo(AutoAddIcon);
