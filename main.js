$.getJSON('sins.json', function (sinData) {
  var defaultHidden = []
  for (const key in sinData) {
    if (sinData.hasOwnProperty(key) && sinData[key].children) {
      defaultHidden.push(...sinData[key].children)
    }
  }
  $(function () {
    $('#results').hide()
    var parent = $('<ul></ul>')
    sinData.forEach(function (sin, id) {
      var el = $('<li><label><input type="checkbox" /> </label></li>')
      el.attr('id', id + 1)
      el.children('label').append($('<div class="label">').text(sin.text))
      el.data('children', sin.children ? sin.children : [])
      parent.append(el)
    })
    $('#list').append(parent)

    var AllLi = $('#list li')
    defaultHidden.forEach(function (id) {
      $(`#${id}`).hide()
    })

    $('input[type="checkbox"]').on('input', function (e) {
      var b = $(e.currentTarget).prop('checked')  // yes its bad shut up
      $(e.currentTarget).parent().parent().data('children').forEach(function (child, id) {
        $(`#${child}`).stop(true, true)
        $(`#${child} input`).prop('disabled', !b).prop('checked', false)
        $(`#${child}`)[b ? 'show' : 'hide']({ duration: 400, queue: false }).children().addClass('child')
      })
    })


    $('.submit').click(function () {
      var allBoxes = $('input[type="checkbox"]:not(.ignore)')
      var count = 0
      var arr = []
      allBoxes.each(function () {
        arr.push($(this).prop('checked') ? 1 : 0)
      })
      var octets = arr.join('').match(/.{1,8}/g)
      var out = []
      octets.forEach(function (octet) {
        var word = parseInt(octet, 2).toString(16)
        out.push(word.length < 2 ? '0' + word : word)
      })
      data = out.join('')
      if (window.location.hash === '#qr') {
        $('#qr').attr('src', 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&format=png&data=' + data)
      }

      var sinList = $('input[type="checkbox"]:not(.ignore):checked')
      $('#score').text(100-((sinList.length/sinData.length)*(100)))
      $('#questions').hide()
      $('#results').show()
    })

    $('.reset').click(function () {
      $('input:checkbox').prop('checked', false)
    })

    $('#back').click(function () {
      $('#questions').show()
      $('#results').hide()
    })

    $('body').css('opacity', '1')
  })
})