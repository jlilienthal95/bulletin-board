export type NoteType = {
  id?: number;
  color: string;
  coordinates: {
    x: number;
    y: number;
  };
  noteText: string | null;
  tilt: TiltType;
};

export type TiltType = `rotate-[${0 | 1 | 2 | 3}deg]` | `-rotate-[${1 | 2 | 3}deg]`;

// export type ColorType = 