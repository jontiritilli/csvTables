var $table = $('#table');
var $remove = $('#remove');
var selections = [];
var data = data;

function getIdSelections() {
  return $.map($table.bootstrapTable('getSelections'), function (row) {
    return row.id
  })
}

function responseHandler(res) {
  $.each(res.rows, function (i, row) {
    row.state = $.inArray(row.id, selections) !== -1
  })
  return res
}

function detailFormatter(index, row) {
  var html = []
  $.each(row, function (key, value) {
    html.push('<p><b>' + key + ':</b> ' + value + '</p>')
  })
  return html.join('')
}

function operateFormatter(value, row, index) {
  return [
    '<a class="like" href="javascript:void(0)" title="Like">',
    '<i class="fa fa-heart"></i>',
    '</a>  ',
    '<a class="remove" href="javascript:void(0)" title="Remove">',
    '<i class="fa fa-trash"></i>',
    '</a>'
  ].join('')
}

window.operateEvents = {
  'click .like': function (e, value, row, index) {
    alert('You click like action, row: ' + JSON.stringify(row))
  },
  'click .remove': function (e, value, row, index) {
    $table.bootstrapTable('remove', {
      field: 'id',
      values: [row.id]
    })
  }
}

function totalTextFormatter(data) {
  return 'Total'
}

function totalNameFormatter(data) {
  return data.length
}

function totalPriceFormatter(data) {
  var field = this.field
  return '$' + data.map(function (row) {
    return +row[field].substring(1)
  }).reduce(function (sum, i) {
    return sum + i
  }, 0)
}

function initTable() {
  //TODO: This doesn't work. I don't know why.
  var csvUrl = "http://localhost:3000/csv";
  var dataSource = "https://docs.google.com/spreadsheets/d/1FRonP_omhMxrO8Gp67uAEultrYdPQwk90W6LUzryP5s/gviz/tq?&tqx:out=csv";

  var columns = [
    {
      field: 'officerName',
      title: 'Officer Name',
      sortable: true
    },
    {
      field: 'agency',
      title: 'Agency'
    },
    {
      field: 'allegation',
      title: 'Allegation'
    },
    {
      field: 'lengthOfSanction(Months)',
      title: 'Length of Sanction'
    },
    {
      field: 'dates',
      title: 'Dates'
    },
    {
      field: 'disciplineMeeting',
      title: 'Discipline Meeting'
    },
    {
      field: 'nayVotes(%)',
      title: 'Nay Votes (%)'
    },
    {
      field: 'yayVotes(%)',
      title: 'Yay Votes (%)'
    },
    {
      field: 'abstentionVotes(%)',
      title: 'Abstentation Votes (%)'
    },
    {
      field: 'returnToLE(Y/N)',
      title: 'Return to LE?'
    },
    {
      field: 'sanctionImposed',
      title: 'Sanctions'
    },
    {
      field: 'yearsOnJob',
      title: 'Years on Job'
    }
  ];

  var data = fetch(`${csvUrl}?url=${dataSource}`)
    .then(response => response.json())
    .then(data => {
      const cols = data.headers;
      $table.bootstrapTable('destroy').bootstrapTable({
        data: data.data,
        columns: columns
      })
    })

  $table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
  function () {
    $remove.prop('disabled', !$table.bootstrapTable('getSelections').length)

    // save your data, here just save the current page
    selections = getIdSelections()
    // push or splice the selections if you want to save all data selections
  })

  $remove.click(function () {
    var ids = getIdSelections()
    $table.bootstrapTable('remove', {
      field: 'id',
      values: ids
    })
    $remove.prop('disabled', true)
  })
}

$(function() {
  initTable()

  $('#locale').change(initTable)
})