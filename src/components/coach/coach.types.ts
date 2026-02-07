import { ITranslator } from '../../utils/i18n.types';
import { IChatMessage } from '../../utils/storage.types';

export interface IMessageBubbleProps {
  message: IChatMessage;
  translator: ITranslator;
}

export interface IChip {
  key: string;
  label: string;
}

export interface ISuggestedChipsProps {
  chips: IChip[];
  onChipPress: (chipKey: string) => void;
}

export interface IChatInputProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  canSend: boolean;
  remaining: number;
  limitReached: boolean;
  translator: ITranslator;
  onFocus: () => void;
}
