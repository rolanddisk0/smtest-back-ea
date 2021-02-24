const todoMapping = {
  dit_p_sd_all: `INCIDENTSM1 m1 with (nolock)
      inner join INCIDENTSM2 m2 with (nolock) on m1.INCIDENT_ID = m2.INCIDENT_ID
      inner join INCIDENTSM3 m3 with (nolock) on m1.INCIDENT_ID = m3.INCIDENT_ID
      inner join INCIDENTSM4 m4 with (nolock) on m1.INCIDENT_ID = m4.INCIDENT_ID`, // TODO: как регулировать количество таблиц? см в дбдикт?
  dit_p_im_all: `PROBSUMMARYM1 m1 with (nolock)
      inner join PROBSUMMARYM2 m2 with (nolock) on m1.NUMBER = m2.NUMBER
      inner join PROBSUMMARYM3 m3 with (nolock) on m1.NUMBER = m3.NUMBER
      inner join PROBSUMMARYM4 m4 with (nolock) on m1.NUMBER = m4.NUMBER
      inner join PROBSUMMARYM5 m5 with (nolock) on m1.NUMBER = m5.NUMBER`,
  dit_p_cm3_all: `CM3RM1 m1 with (nolock)
      inner join CM3RM2 m2 with (nolock) on m1.NUMBER = m2.NUMBER
      inner join CM3RM3 m3 with (nolock) on m1.NUMBER = m3.NUMBER
      inner join CM3RM4 m4 with (nolock) on m1.NUMBER = m4.NUMBER`
}

const relationMapping = {
  problem: todoMapping['dit_p_im_all'],
  incidents: todoMapping['dit_p_sd_all'],
  cm3r: todoMapping['dit_p_cm3_all'],
}

const unuqueKeysRelation = {
  incidents: 'INCIDENT_ID', 
  problem: 'NUMBER',
  cm3r: 'NUMBER'
}

const viewNameMapping = {
  dit_p_sd_all: 'incidents', 
  dit_p_im_all: 'probsummary',
  dit_p_cm3_all: 'cm3r'
}

const unuqueKeys = {
  dit_p_sd_all: 'INCIDENT_ID', 
  dit_p_im_all: 'NUMBER',
  dit_p_cm3_all: 'NUMBER'
}


/*
const unuqueKeys = {
  dit_p_sd_all: 'incident_id', 
  dit_p_im_all: 'number',
  dit_p_cm3_all: 'number'
}*/

module.exports = {
  todoMapping: todoMapping,
  viewNameMapping: viewNameMapping,
  relationMapping: relationMapping,
  unuqueKeysRelation: unuqueKeysRelation,
  unuqueKeys: unuqueKeys
} 