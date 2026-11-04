import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from '@/i18n/I18nContext';
import { Pyramid } from '@/types/pyramid';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pyramids: Pyramid[];
}

const AboutDialog = ({ open, onOpenChange, pyramids }: AboutDialogProps) => {
  const { t } = useI18n();
  const count = (status: string) => pyramids.filter((p) => p.stato_verifica === status).length;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.aboutData}</DialogTitle>
          <DialogDescription className="leading-relaxed">{t.aboutDataBody}</DialogDescription>
        </DialogHeader>
        <ul className="text-xs font-mono space-y-1">
          <li>{t.statusVerified}: {count('verified')}</li>
          <li>{t.statusPartial}: {count('partial')}</li>
          <li>{t.statusUnverified}: {count('unverified')}</li>
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;
