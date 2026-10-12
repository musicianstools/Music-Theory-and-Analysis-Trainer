// Model sentences for each part of each Practice Exam question (keyed by responsePrompts id).
// These drive the "Practice Exam Skills" mini tasks: every short task practises one part of a real exam response.
// Introduction order: context → preview of the three moments → thesis (which should be the last sentence of the introduction).

export const examParts = {
  'rp-001': {
    context: '"Someone Like You" (2011) is a piano-and-voice ballad by Adele that explores heartbreak in the aftermath of a relationship.',
    preview: 'The song moves from restrained, low-register verses to a straining leap into the chorus, before a closing section returns to the same unchanging piano pattern.',
    thesis: 'Through these moments, Adele presents heartbreak as a quiet resignation that cannot stay contained.',
    moments: [
      {
        topic: 'The first key moment, the opening verse, establishes heartbreak as a private grief the speaker is trying to accept.',
        analysis: 'The vocal phrases sit in a low, conversational register and repeatedly fall at their endings over a bare, arpeggiated piano accompaniment. This creates a sense of restraint and sinking resignation, suggesting that each attempt to move on falls back.',
        connection: 'The exposed voice-and-piano texture works with the falling melodic shape, leaving the voice with nothing to hide behind and reinforcing heartbreak as private and unprotected.',
      },
      {
        topic: 'The second key moment, the chorus, develops the argument by showing that this resignation is incomplete.',
        analysis: 'The melody leaps into a higher, more strained register and the vocal intensity increases, with ornamented, leaning notes at the emotional peaks. This creates a sense of release, as if the grief can no longer be contained.',
        connection: 'The rising register and the increased vocal intensity work together, contrasting sharply with the low, falling verses and presenting heartbreak as something that breaks through despite the speaker\'s restraint.',
      },
      {
        topic: 'The final key moment, the closing section, completes the argument by refusing to resolve the grief.',
        analysis: 'The texture returns to voice and the same repeating piano figure, with no instrumental climax or new harmonic direction. This creates a circular, unfinished feeling, suggesting that the speaker ends where they began.',
        connection: 'The unchanging arpeggios combine with the return to a quieter vocal delivery, so the music itself seems unable to move on, reinforcing heartbreak as unresolved.',
      },
    ],
    transition: 'This restraint is challenged in the chorus, where the grief the verses held back begins to break through.',
    judgement: 'Ultimately, the movement from restrained verses to straining choruses and back again effectively presents heartbreak as a quiet resignation that cannot stay contained.',
  },
  'rp-002': {
    context: '"Fix You" (2005) by Coldplay is an alternative rock ballad that explores grief and the possibility of hope.',
    preview: 'It opens with fragile organ chords and falsetto, withholds the full band for much of the song, and then returns to a quieter, more intimate ending.',
    thesis: 'Through these moments, Coldplay present hope as something that grows slowly out of grief rather than replacing it.',
    moments: [
      {
        topic: 'The first key moment, the opening, presents hope as barely present — a fragile reassurance in the middle of grief.',
        analysis: 'Sustained organ chords with almost no rhythmic movement support a soft falsetto vocal. This creates a still, hushed atmosphere with hymn-like associations, presenting grief as a moment of solemn stillness.',
        connection: 'The fragile falsetto timbre and the minimal texture work together, making the voice sound vulnerable and alone, which suggests that hope at this point is only tentative.',
      },
      {
        topic: 'The second key moment, the entry of the full band, develops hope into a powerful, shared release.',
        analysis: 'After a long build, drums and electric guitar enter and the dynamics increase dramatically. This creates a cathartic release of the tension accumulated since the opening, suggesting that hope has finally gathered strength.',
        connection: 'The sudden thickening of the texture and the dynamic surge reinforce each other, and because both were delayed for so long, the arrival feels earned rather than instant.',
      },
      {
        topic: 'The final key moment, the ending, complicates the triumph by returning to a quieter texture.',
        analysis: 'In the closing section, the full band falls away and the song ends in a more intimate texture. This creates a sense of reflection rather than victory, suggesting that hope coexists with loss instead of erasing it.',
        connection: 'The reduced texture and softer dynamics together echo the opening, suggesting that the grief of the opening is still present at the end.',
      },
    ],
    transition: 'This fragility is gradually transformed as the song builds towards its full-band section.',
    judgement: 'Ultimately, the slow, delayed build and the return to quiet effectively present hope as hard-won and fragile, growing out of grief rather than replacing it.',
  },
  'rp-003': {
    context: '"Man in the Mirror" (1987), performed by Michael Jackson, is a gospel-influenced pop song about personal and social change.',
    preview: 'It begins with an intimate solo vocal, gathers layers through its choruses, and ends with an upward key change and a gospel choir.',
    thesis: 'Through these moments, Michael Jackson presents change as beginning with one individual and growing into collective action.',
    moments: [
      {
        topic: 'The first key moment, the opening, presents change as a private, personal decision.',
        analysis: 'In the opening, a solo voice is supported only by keyboard in a sparse texture. This creates an intimate, reflective atmosphere, as if the speaker is thinking aloud.',
        connection: 'The sparse texture and the restrained vocal delivery work together to keep the focus on one individual, establishing where the journey of change begins.',
      },
      {
        topic: 'The second key moment, the choruses, develops change into an idea that gathers support.',
        analysis: 'Band layers and backing vocals are added and the dynamics grow fuller. This creates a sense of momentum, as though other voices are joining the speaker\'s call.',
        connection: 'The thickening texture and the added backing vocals reinforce each other, showing the message spreading beyond a single person.',
      },
      {
        topic: 'The final key moment, the closing section, presents change as communal and urgent.',
        analysis: 'The key rises by a semitone and a gospel choir answers the lead vocal in call and response, while the lead becomes increasingly improvised. This creates a surge of energy and conviction, suggesting that change has become urgent and shared.',
        connection: 'The upward modulation lifts the music into a brighter register while the call and response turns one voice into many; together, they present change becoming a collective movement.',
      },
    ],
    transition: 'This individual reflection grows as more musical layers join the song.',
    judgement: 'Ultimately, the song\'s structure effectively enacts its message: the music itself changes, growing from one voice into a communal, urgent call for action.',
  },
  'rp-004': {
    context: '"Let It Be" (1970) by The Beatles is a piano-led, gospel-influenced ballad that reflects on acceptance and finding comfort in difficult times.',
    preview: 'It moves from a hymn-like solo piano opening, through a texture that gradually fills with organ, bass and drums, to the fuller band sound of the guitar solo and later choruses.',
    thesis: 'Through these moments, The Beatles present acceptance as a source of comfort and strength rather than defeat.',
    moments: [
      {
        topic: 'The first key moment, the opening, presents acceptance as calm consolation.',
        analysis: 'Solo piano and voice outline a stable, repeating I–V–vi–IV progression in a hymn-like style. This creates a sense of solemn calm and predictability, suggesting that acceptance brings stability rather than despair.',
        connection: 'The steady harmonic pattern and the hymn-like piano timbre work together, suggesting that acceptance offers stability rather than despair.',
      },
      {
        topic: 'The second key moment, the middle of the song, develops acceptance into communal support.',
        analysis: 'Organ, bass and drums gradually join the piano, filling the texture. This creates warmth and a sense of support gathering around the voice, suggesting that the speaker is no longer alone.',
        connection: 'The organ\'s sustained, church-like timbre combines with the thickening texture, reinforcing the gospel associations and presenting acceptance as shared.',
      },
      {
        topic: 'The final key moment, the guitar solo and later choruses, presents acceptance as a source of strength.',
        analysis: 'In the guitar solo and later choruses, the full band plays more forcefully over the same chord progression. This creates energy and confidence while the harmony stays stable, suggesting that acceptance has become a source of strength.',
        connection: 'The more forceful instrumental playing contrasts with the unchanging progression beneath it, suggesting strength that grows without losing its calm foundation.',
      },
    ],
    transition: 'This private comfort is gradually shared as the texture grows.',
    judgement: 'Ultimately, the combination of stable, hymn-like harmony and a gradually strengthening texture effectively presents acceptance as comforting and empowering rather than defeated.',
  },
  'rp-005': {
    context: '"We Are the Champions" (1977) by Queen is a rock power ballad that celebrates triumph after hardship.',
    preview: 'It contrasts a restrained, reflective opening verse with an explosive first chorus and a fully layered final chorus.',
    thesis: 'Through these moments, Queen present triumph as hard-won and collective, earned through struggle.',
    moments: [
      {
        topic: 'The first key moment, the opening verse, presents the struggle that comes before triumph.',
        analysis: 'The verse is piano-led, with a restrained texture and a reflective vocal delivery. This creates a sense of endurance and introspection rather than celebration.',
        connection: 'The restrained dynamics and the sparse, piano-led texture work together to hold back energy, establishing what the triumph must overcome.',
      },
      {
        topic: 'The second key moment, the first chorus, presents triumph as a shared release.',
        analysis: 'The full band enters with heavily multi-tracked vocals and a large increase in dynamics over a broad compound metre. This creates an anthemic sense of release, suggesting that the struggle has been overcome together.',
        connection: 'The dynamic contrast with the verse and the layered vocals reinforce each other, so the victory sounds both earned and communal — many voices singing as one.',
      },
      {
        topic: 'The final key moment, the last chorus, presents triumph as sustained and collective.',
        analysis: 'The chorus returns as the most fully layered statement of the song. This creates a sense of culmination, suggesting that the triumph is shared and lasting.',
        connection: 'The dense vocal layering combines with the swaying compound metre, inviting a crowd to sing and move together and reinforcing triumph as communal.',
      },
    ],
    transition: 'This restraint makes the arrival of the chorus all the more powerful.',
    judgement: 'Ultimately, the contrast between restrained verses and fully layered choruses effectively presents triumph as a collective celebration earned through struggle.',
  },
};
