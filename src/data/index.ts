import pyramidsData from './pyramids.json';
import { pyramidImages } from './pyramidImages';
import { Pyramid } from '@/types/pyramid';

/** English is the base language. Other languages are overlays in ./locales, loaded on demand. */
export const allPyramids: Pyramid[] = (pyramidsData as Pyramid[]).map((p) => ({
  ...p,
  ...(pyramidImages[p.id] || {}),
}));

export const TOUR_IDS = [
  'saqqara_djoser',
  'giza_great',
  'ziggurat_ur',
  'caral',
  'nubian_meroe',
  'teotihuacan_sun',
  'cholula',
  'tikal_temple1',
  'borobudur',
  'chichen_itza',
  'monks_mound',
].filter((id) => allPyramids.some((p) => p.id === id));
