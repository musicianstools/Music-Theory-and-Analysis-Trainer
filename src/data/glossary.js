// Musical terminology used by the writing coach to detect precise vocabulary,
// and by the glossary panel. Add terms freely — lower-case, singular stem is enough
// (matching is prefix-based, so "crescendo" also matches "crescendos").

export const GLOSSARY = {
  dynamics: ['dynamic', 'crescendo', 'decrescendo', 'diminuendo', 'fortissimo', 'pianissimo', 'forte', 'mezzo', 'sforzando', 'dynamic contrast', 'terraced dynamics'],
  pitch: ['phrase', 'ascending', 'descending', 'stepwise', 'conjunct', 'disjunct', 'leap', 'register', 'falsetto', 'head voice', 'chest voice', 'range', 'tessitura', 'melisma', 'melismatic', 'syllabic', 'sequence', 'motif', 'hook', 'appoggiatura', 'countermelody', 'contour'],
  harmony: ['harmony', 'harmonic', 'chord', 'progression', 'cadence', 'perfect cadence', 'plagal', 'imperfect cadence', 'interrupted cadence', 'tonic', 'dominant', 'subdominant', 'dissonan', 'consonan', 'suspension', 'pedal', 'drone', 'modulat', 'key change', 'major', 'minor', 'modal', 'dorian', 'mixolydian', 'chromatic', 'diatonic', 'tonality', 'tonal centre', 'resolution', 'unresolved', 'arpeggi', 'seventh'],
  rhythm: ['syncopat', 'ostinato', 'riff', 'triplet', 'dotted rhythm', 'metre', 'meter', 'compound', 'simple time', 'backbeat', 'hemiola', 'rhythmic density', 'quaver', 'semiquaver', 'crotchet', 'rubato', 'groove', 'polyrhythm', 'accent'],
  tempo: ['tempo', 'rallentando', 'ritardando', 'accelerando', 'a tempo', 'fermata', 'pause'],
  texture: ['texture', 'homophonic', 'polyphonic', 'monophonic', 'heterophonic', 'contrapuntal', 'counterpoint', 'unison', 'layered', 'layering', 'sparse', 'dense', 'thin', 'thick', 'call and response', 'a cappella', 'backing vocals', 'choir', 'doubling', 'doubled'],
  timbre: ['timbre', 'full band', 'guitar', 'drum', 'piano', 'keyboard', 'bass line', 'vocal', 'tone colour', 'breathy', 'distortion', 'distorted', 'reverb', 'vibrato', 'tremolo', 'muted', 'pizzicato', 'synth', 'organ', 'strings', 'brass', 'instrumentation', 'orchestration'],
  articulation: ['staccato', 'legato', 'tenuto', 'marcato', 'slur', 'articulation'],
  form: ['structure', 'verse', 'chorus', 'pre-chorus', 'bridge', 'middle eight', 'intro', 'outro', 'coda', 'ternary', 'binary', 'rondo', 'strophic', 'through-composed', 'refrain', 'build-up', 'breakdown'],
};

export const GLOSSARY_TERMS = [...new Set(Object.values(GLOSSARY).flat())];
