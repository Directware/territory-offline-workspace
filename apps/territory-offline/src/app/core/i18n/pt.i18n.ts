export const pt = {
  language: 'Língua',
  common: {
    shareNotAvailable:
      'Infelizmente, a partilha não está disponível nesta plataforma. O texto é copiado para a prancheta.',
    ignore: 'Ignorar',
    choose: 'Por favor seleccione',
    nothingChosen: 'Nada seleccionado',
    skip: 'saltar',
    color: 'Cor',
    opacity: 'Transparência',
    create: 'Criar',
  },
  assignments: {
    startTime: 'Data de emissão',
    endTime: 'Data de regresso',
    sendToPublisher: 'Enviar mapa regional aos pregadores',
    delete: 'Eliminar a atribuição',
    add: '+ Nova atribuição',
    unkown: 'Desconhecido',
    edit: 'Editar Alocação',
    digitalTerritory: 'Território Digital',
    sharingFailed: 'A partilha de ficheiros falhou',
    new: 'Nova atribuição',
    body: 'Olá {{{firstName}},\n\n no anexo encontrará o seu novo território!',
    return: 'Quer devolver esta área?',
    returnFromFieldCompanion: 'Quer devolver a área {{key}} {{name}}',
    proceed: 'Deseja reportar esta área como editada?',
    title: 'Alocação',
  },
  overdueAssigments: {
    startTime: 'Data de emissão',
    endTime: 'Data de regresso',
    hasSince: 'Propriedade desde',
    edit: 'Editar Alocação',
    shareOverdueFirstSentence: 'De acordo com as minhas notas, tem as seguintes áreas:',
    shareOverdueLastSentence: 'Quando foi a última vez que os editou?',
  },
  congregation: {
    name: 'Nome',
    language: 'Língua',
    duplicate: 'Duplicar esta reunião',
    delete: 'Eliminar reunião',
    use: 'Gerir esta reunião',
    lastDoing: 'Últimas acções',
    noLastDoings: 'Ainda não aconteceu nada.',
    add: 'Nova reunião',
    territories: 'Áreas',
    reallyDuplicate: 'Quer mesmo copiar esta reunião?',
    reallyDelete: 'Quer mesmo apagar esta reunião?',
  },
  territory: {
    title: 'Área',
    toKml: 'Exportar como KML',
    fromKml: 'Importação da KML',
    populationCount: 'Unidades de apartamentos',
    publishers: 'Anunciador',
    allVisitBans: 'Não visitar',
    add: 'Nova área',
    filter: 'Filtro',
    inProcessing: 'Em processo',
    processed: 'Editado',
    assign: 'Reatribuir',
    reasignDue: 'atribuição devida',
    none: 'Ainda não tem nenhuma área!',
    noneMessage: 'Criar ou importar territórios para os gerir.',
    location: 'Lugar',
    number: 'Número',
    units: 'Unidades residenciais',
    comment: 'Comentário',
    tags: 'Etiquetas',
    print: {
      title: 'Área de impressão',
      format: 'Formato',
      editLook: 'Editar aparência',
      name: 'Nome da área',
      number: 'Número da área',
      units: 'Unidades residenciais',
      comment: 'Comentário',
      cuttingMarks: 'Marcas de corte',
      compass: 'Bússola',
      resetCompass: 'Reiniciar bússola',
      autoAlign: 'Alinhar a área automaticamente',
      saveAlignment: 'Lembrar orientação para este cartão',
      flipCard: 'Virar o cartão',
      visitBans: 'Não visitar',
      visitBanBell: 'Nome / Sino',
      visitBanDate: 'Data',
      streetList: 'Liste der Straßen',
      streets: 'Estradas',
      address: 'Endereço',
      alignmentSaved: 'O alinhamento foi salvo!',
    },
    send: 'Enviar mapa regional aos pregadores',
    currentAssignment: 'Atribuição actual',
    publisher: 'Anunciador',
    unkownPublisher: 'Desconhecido',
    startTime: 'Data de emissão',
    processedAssignment: 'Editar Alocação',
    assignment: 'Atribuições',
    visitBans: 'Não visitar endereços',
    streets: 'Estradas',
    addStreet: 'Acrescentar rua',
    delete: 'Eliminar área',
    noDrawing:
      'Não há desenho disponível! Para o salvar, é necessário desenhar limites de área no mapa.',
    pipeNone: 'Não disponível',
    streetAlreadyExist: 'A rua {{street}} já lá está!',
    reallyRemoveStreet: 'Quer mesmo apagar {{street}}',
    reallyDelete: 'Quer mesmo apagar esta área?',
  },
  dashboard: {
    serviceYear: 'Ano de serviço',
    processed: 'Territórios editados',
    PopulationCountProcessed: 'Unidades de apartamentos editadas',
    assignments: 'Áreas atribuídas',
    overdueAssignments: 'Processamento devido',
    noOverdueAssignments: 'Óptimo! Não há processos devidos.',
    overdueTerritories: 'Atribuições devidas',
    noOverdueTerritories: 'Óptimo! Não há atribuições devidas.',
  },
  configuration: {
    mapOrigin: 'Alinhar mapa aqui',
    passwordLine1: 'Por favor, dê o nome do seu',
    passwordLine2: 'área de montagem e estabelecer uma senha,',
    passwordLine3: 'que se possa recordar.',
    welcomeLine2: 'em Território Offline!',
    welcomeLine1: 'Bem-vindo',
    passwordNotSame: 'As palavras-passe devem ser as mesmas.',
    territoryLocation: 'Qual é a sua área?',
    moveMap: 'Por favor, mova o mapa para o centro da sua área.',
    congregation: 'Reunião',
    password: 'Senha',
    repeatPassword: 'repetir palavra-passe',
  },
  lockScreen: {
    messageLine1: 'Territory Offline',
    messageLine2: 'está trancado!',
    enterPassword: 'Introduza a palavra-chave',
    unlock: 'Desbloquear aplicação',
    decryptPublishers: 'Os anunciadores são descodificados...',
    decryptTerritories: 'As áreas são descodificadas...',
    decryptAssignments: 'As alocações são descodificadas...',
    decryptAddresses: 'Os endereços são decifrados...',
    decryptTags: 'As etiquetas são desencriptadast......',
    decryptDrawings: 'Os desenhos são descodificados...',
    decryptCongregations: 'As reuniões são decifradas...',
  },
  publisher: {
    title: 'Anunciador',
    name: 'Nome',
    firstName: 'Primeiro nome',
    mail: 'Correio',
    phone: 'Telefone',
    dsgvo: 'DSGVO',
    tags: 'Etiquetas',
    assignments: 'Áreas alocadas',
    noAssignments: 'Sem áreas atribuídas',
    delete: 'Eliminar pregadores',
    dsgvoMessage:
      'Depois de ler a política de privacidade, pode dar aqui o seu consentimento. Por favor, assine na caixa.',
    add: 'Novo Herald',
    none: 'Ainda não tem nenhum pregador!',
    noneMessage: 'Criar ou importar enunciadores para poder atribuir-lhes territórios.',
    reallyDelete: 'Quer mesmo apagar este pregador?',
    canNotDelete: '{{firstName}} {{name}} ainda atribuiu áreas e, portanto, não pode ser apagado.',
  },
  settings: {
    general: 'Geral',
    processingDueAfter: 'Processamento devido após',
    dueMonth: '{{count}} meses',
    processingDueHintLine1:
      'Este período determina quanto tempo deve demorar a processar uma área.',
    processingDueHintLine2:
      'Se este período for excedido, a área é exibida no painel de instrumentos na área "Processamento devido".',
    reassignAfter: 'Reatribuir por',
    hint: 'Nota',
    reassignAfterHintLine1:
      'Este período determina quanto tempo uma área deve ser deixada em pousio.',
    reassignAfterHintLine2:
      'Se este período de tempo for excedido, a área no mapa é colorida a amarelo/laranja.',
    reassignDueAfter: 'Atribuição devida após',
    reassignDueAfterHintLine1:
      'Este período determina quando uma área deve definitivamente ser trabalhada.',
    reassignDueAfterHintLine2:
      'Se este período for excedido, a área é exibida no painel de instrumentos na área "Alocação devida".',
    version: 'Versão',
    versionAvailable: 'Versão {{version}} disponível',
    territories: 'Áreas',
    alignMap: 'Alinhar mapa',
    security: 'Segurança',
    changePassword: 'Alterar palavra-passe',
    autoLock: 'Bloqueio automático',
    lockApp: 'Aplicação de bloqueio',
    lockAppCmd: 'shift + cmd + L',
    lockMinutes: '{{count}} Min',
    lockNever: 'Nunca',
    reset: 'Apagar todos os dados',
    support: 'Apoio aos desenvolvedores',
    about: 'Sobre a App',
    contact: 'Contacto',
    alreadyLatestVersion: 'Tem a versão mais recente.',
    errorOccured:
      'Ocorreu um erro. Por favor tente novamente mais tarde ou vá ao nosso site: https://territory-offline.com',
    reallyReset: 'Quer mesmo apagar tudo?',
    restartApp: 'Por favor, reinicie a aplicação.',
  },
  title: 'Territory Offline',
  visitBan: {
    noAdresses: 'Nenhum endereço encontrado',
    setMark: 'Marca de fixação na área',
    reset: 'Reinicialização',
    setManually: 'Colocar endereço manualmente',
    comment: 'Comentário',
    lastVisit: 'Última visita',
    delete: 'Apagar endereço',
    notTerritoryReference:
      'Este endereço não se refere a nenhuma área. É preciso geocodificá-lo novamente...',
    retry: 'Tente novamente!',
    title: 'Não visitar',
    sort: 'Ordenação',
    sortAlphabetical: 'Por ordem alfabética',
    noAdressesHint: 'Ainda não tem endereços!',
    noAdressesHintDescription: 'Criar ou importar endereços para os gerir.',
    add: 'Novo endereço',
    street: 'Rua',
    editAdress: 'Endereço de edição',
    name: 'Nome',
    address: 'Endereço',
    reallyDelete: 'Quer mesmo apagar este endereço?',
    noTerritoryMapped:
      'O marcador não pode ser atribuído a nenhuma área. Por favor, coloque um marcador numa área.',
    multipleTerritories:
      'Erro - ambiguidade! O marcador está em {{count}} territórios ({{territories}}).  Por favor, certificar-se de que os desenhos da área não se sobrepõem.',
    noName: 'sem nomee',
    today: 'Inscreva-se hoje',
  },
  transfer: {
    sync: {
      title: 'Sincronizar',
      import: 'dados de importação',
      export: 'partilhar informação',
    },
    returnTerritory: 'Território de regresso',
    returnTerritoryFromFieldCompanion: 'Ficheiro do Acompanhante de Campo',
    export: {
      title: 'Exportação',
      publisher: 'Anunciador',
      firstName: 'Primeiro nome',
      lastName: 'Apelido',
      mail: 'E-Mail',
      phone: 'Telefone',
      territories: 'Áreas',
      number: 'Número',
      name: 'Designação',
      visitBans: 'Não visitar',
      level: 'Stock',
      street: 'Straße',
      numberShort: 'Não.',
      city: 'Cidade',
      lastVisit: 'Última visita',
      comment: 'Comentário',
      latitude: 'Latitude',
      longitude: 'Longitude',
      territoryState: 'Estado do território',
      monthNotProceed: 'Meses não processados',
      yearsNotProceed: 'Ano não processado',
      bellPosition: 'Posição do sino',
      noTerritories: 'Não há áreas para exportar!',
    },
    exportBackup: 'Ficheiro de backup',
    exportS13: 'PDF: S13 Formulário',
    exportKML: 'KML: Mapa geral',
    exportVisitBans: 'EXCEL: Não visitar endereços',
    exportPublishers: 'EXCEL: Anunciador',
    exportTerritoryNames: 'EXCEL: Nomes de áreas',
    exportTerritoryState: 'EXCEL: Estado do território',
    importFromTerritoryHelper: 'Territory Helper',
    importFromTerritoryWeb: 'Territory Web',
    importFromApp: 'Importação a partir de Apps',
    importFromExcel: 'Importação de Excel',
    importVisitBans: 'Não visitar endereços',
    importPublishers: 'Anunciador',
    territoryHelper: {
      headLine1: 'Importe os seus dados',
      headLine2: 'de TerritoryHelper',
      infoLine1: 'Se a sua reunião até agora com TerritoryHelper',
      infoLine2: 'pode simplesmente guardar os seus dados em TerritoryOffline',
      infoLine3: 'assumir. Seleccionar os ficheiros apropriados',
      infoLine4: '— nós fazemos o resto!',
      publishers: 'Anunciador',
      territories: 'Áreas',
      assignments: 'Atribuições',
      optional: 'opcional',
      visitBans: 'Não visitar',
      import: 'Importação',
    },
    importExcel: {
      cancel: 'Cancelar',
      continue: 'Continuar',
      fileType: 'Tipo de dados',
      chooseFile: 'Seleccionar ficheiro',
      mapData: 'Atribuir dados',
      next: 'Weiter',
      mapDataInfo:
        'Infelizmente, não sabemos como estruturou a sua mesa. Portanto, a próxima coisa que vê são os títulos de todas as colunas encontradas no seu ficheiro. Por favor, atribua cada coluna ao tipo de dados que procuramos.',
      import: 'Importação',
      verify: 'Verificar se as colunas estão atribuídas correctamente.',
      override: 'Os dados já existentes devem ser actualizados?',
      foundSheets: 'Folhas encontradas',
      foundColumns: 'Colunas encontradas',
      mappedColumns: 'Colunas atribuídas',
      success: 'Importado com sucesso',
      failures: 'As seguintes entradas não puderam ser importadasn',
      successMessage:
        'Os endereços não visíveis da sua reunião foram importados e estão agora disponíveis para que possa editá-los.',
      chooseSheets: 'Por favor seleccione em qual dos <strong>Sheets</strong> os seus dados são',
      chooseNameColumns: 'Por favor, seleccione em qual das colunas o <strong>Nomes</strong> são.',
      chooseStreetColumn:
        'Por favor, seleccione em qual das colunas o <strong>Estradas</strong> são.',
      chooseHouseNumberColumn:
        'Por favor, seleccione em qual das colunas o <strong>Números das casas</strong> são.',
      chooseCitiesColumn:
        'Por favor, seleccione em qual das colunas o <strong>Cidades</strong> são.',
      chooseLatitudeColumn:
        'Por favor, seleccione em qual das colunas o <strong>Latitudes</strong> são.',
      chooseLongitudeColumn:
        'Por favor, seleccione em qual das colunas o <strong>Longitude</strong> são.',
      chooseCommentColumn:
        'Por favor, seleccione em qual das colunas o <strong>Comentários</strong> são.',
      chooseLastVisitColumn:
        'Por favor, seleccione em qual das colunas o <strong>últimas visitas</strong> são.',
      visitBanCols: {
        name: 'Nome',
        street: 'Rua',
        streetSuffix: 'Número da casa',
        city: 'Cidade',
        latitude: 'Latitude',
        longitude: 'Longitude',
        comment: 'Comentário',
        lastVisit: 'Última visita',
        creationTime: 'Data de criação',
      },
      skipped: 'Ignorado',
    },
    import: {
      title: 'Importação',
      geoJson: 'GEO Json',
      geoJsonDesc:
        'O formato GEO Json pode ter campos de propriedades que também pode querer importar. Estes campos podem ter um valor:',
      geoJsonDesc2: 'Pode atribuir estas propriedades:',
      start: 'Começa a importação de dados...',
      tags: 'As etiquetas são importadas...',
      visitBans: 'Não visitar endereços foram importados...',
      publishers: 'Os anunciantes são importados...',
      ok: 'ok',
      assignments: 'As afectações são importadas...',
      territories: 'Os territórios são importados...',
      drawings: 'Os desenhos são importados...',
      noBackup: 'O ficheiro não parece ser uma cópia de segurança.',
      column: 'Coluna',
      noExcelFile: '{{file}} não parece ser um ficheiro Excel!',
      wrongFileType: 'Tipo de ficheiro errado! Por favor, introduza um ficheiro Excel.',
      noJsonFile: 'Tipo de ficheiro errado! Por favor, introduza um ficheiro JSON.',
      importTWTerritories: 'Territory Web - Áreas',
    },
    exportGroupOverseerReport: 'Para supervisores de grupo',
  },
  tag: {
    edit: 'Editar',
    ready: 'Pronto',
    new: 'NEW',
    none: 'Ainda não tem nenhuma etiqueta!',
    noneMessage:
      'Criar novas etiquetas para agrupar áreas, pregadores ou endereços não-visitantes.',
    assigned: 'Etiquetas',
    add: 'Adicionar etiqueta',
    previewNone: 'Nenhuma etiqueta',
    alreadyExist: 'tag com o nome {{name}} já existe!',
    reallyDelete: 'Quer mesmo apagar este dia?',
    removeAllReferences:
      'Esta etiqueta é utilizada. Se o apagar, será removido de todos os registos.',
  },
  action: {
    cancel: 'Cancelar',
    back: 'voltar',
    next: 'Continuar',
    edit: 'Editar',
    save: 'Guardar',
    skip: 'Saltar',
    delete: 'Eliminar',
    keep: 'Guarde',
  },
  modal: {
    wait: 'Por favor aguarde...',
    synchronization: 'Sincronização',
    import: {
      titel: 'Relatório de Importação',
      potentiallyDeletedLine1: 'Os seguintes dados não estão disponíveis na cópia de segurança!',
      potentiallyDeletedLine2: 'O que quer fazer com eles?',
      territories: 'Áreas',
      publishers: 'Anunciador',
      visitBans: 'Não visitar',
      tags: 'Etiquetas',
      assignments: 'Atribuições',
      territory: 'Área',
      endTime: 'Regresso',
      startTime: 'Início',
      added: 'Foram adicionados/alterados os seguintes dados',
      noneAdded: 'Nenhum dado foi alterado.',
      ready: 'Pronto',
      reallyDelete: 'Quer mesmo apagá-lo?',
    },
  },
  search: {
    title: 'Pesquisa',
  },
  platformActions: {
    sync: 'Territory Offline Sync',
    sharingFailed: 'A partilha de ficheiros falhou',
  },
  LastDoingActionsEnum: {
    create: 'criado',
    update: 'modificado',
    delete: 'eliminado',
    print: 'impresso',
    assign: 'atribuído',
    reassign: 'reatribuído',
    assignReturn: 'devolvido',
    import: 'importação',
    export: 'exportação',
  },
};
