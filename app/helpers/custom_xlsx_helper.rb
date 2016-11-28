module CustomXlsxHelper
  COLS = {
    '1' => 'A',
    '2' => 'B',
    '3' => 'C',
    '4' => 'D',
    '5' => 'E',
    '6' => 'F',
    '7' => 'G',
    '8' => 'H',
    '9' => 'I',
    '10' => 'J'
  }

  def build_key_show(data_headers, page_headers)
    key = []
    rerange_header.each do |name|
      key << header.index(name)
    end

    key
  end

  def retruct_row(row, header, rerange_header)
    r = []
    rerange_header.each do |name|
      i = header.index(name)
      r << format_field(row[i], name)
    end

    r
  end

  def format_field(data, col_name)
    case col_name
    when 'ga:date'
      DateTime.strptime(data, '%Y%m%d').strftime('%d/%m/%Y')
    when 'ga:percentNewSessions', 'ga:bounceRate'
      "= ROUND(#{data.to_f/100},4)"
    when 'ga:pageviewsPerSession'
      "= ROUND(#{data}, 2)"
    when 'ga:avgSessionDuration'
      t = Time.at(data.to_i).utc #.strftime("%H:%M:%S")
      Time.new(1970,1,1,0,t.min,t.sec)
    else
      data
    end
  end

  def format_field_page(values, headers)
    result = []
    count = values.count
    i = 0

    headers.each do |col_name|
      result[i] = case col_name
                  when 'ga:date'
                    DateTime.strptime(values[0][i], '%Y%m%d').strftime('%d/%m/%Y')
                  when 'ga:percentNewSessions', 'ga:bounceRate'
                    s = values.sum { |r| r[i].to_f } / count
                    "= ROUND(#{s.to_f/100},4)"
                  when 'ga:pageviewsPerSession'
                    s = values.sum { |r| r[i].to_f } / count
                    "= ROUND(#{s}, 2)"
                  when 'ga:avgSessionDuration', 'ga:avgTimeOnPage'
                    s = values.sum { |r| r[i].to_f } / count
                    t = Time.at(s.to_i).utc # - Time.now.utc_offset
                    Time.new(1,1,1,0,t.min,t.sec)
                  when 'ga:pagePath'
                    convert_page_path(values[0][i])
                  when 'ga:sourceMedium'
                    values[0][i]
                  else
                    values.sum { |r| r[i].to_f }
                  end

      i += 1
    end

    result
  end

  def fetch_row_style(w, styles, option = 'normal')
    styles.map do |s|
      s = get_style(s)
      case option
      when 'total'
        s = s.merge({:alignment => {:horizontal => :right, :vertical => :center, :wrap_text => true}, :bg_color => "595959", :fg_color => "FFFFFF", :b => true})
      when 'grand'
        s = s.merge({:alignment => {:horizontal => :right, :vertical => :center, :wrap_text => true}, :b => true})
      end
      w.styles.add_style(s)
    end
  end

  def get_style(col_name)
    case col_name
    when 'ga:sourceMedium'
      {:alignment => {:horizontal => :left, :vertical => :center, :wrap_text => true}}
    when 'ga:percentNewSessions', 'ga:bounceRate'
      {:format_code => '00.00%', :alignment => {:horizontal => :right, :vertical => :center, :wrap_text => true}}
    when 'ga:avgSessionDuration', 'ga:avgTimeOnPage'
      {:format_code => 'hh:mm:ss', :alignment => {:horizontal => :right, :vertical => :center, :wrap_text => true}}
    else
      {:alignment => {:horizontal => :right, :vertical => :center, :wrap_text => true}}
    end
  end

  def is_date_change(old, current)
    old[0] != current[0]
  end

  def is_page_change(old, current)
    old[0] != current[0]
  end

  def render_total_date_row(i_begin, i_end, row)
    [
      "= CONCATENATE(A#{i_begin},\" Total\")",
      "",
      "= SUM(C#{i_begin}:C#{i_end})",
      "",
      "= SUM(E#{i_begin}:E#{i_end})",
      "",
      "",
      ""
    ]
  end

  def render_grand_total_date_row(row_totals)
    c = row_totals.map{|i_row| "C#{i_row}" }.join(',')
    e = row_totals.map{|i_row| "E#{i_row}" }.join(',')
    [
      "Grand Total",
      "",
      "= SUM(#{c})",
      "",
      "= SUM(#{e})",
      "",
      "",
      ""
    ]
  end

  def render_grand_total_page_row(row_totals)
    c = row_totals.map{|i_row| "C#{i_row}" }.join(',')
    d = row_totals.map{|i_row| "D#{i_row}" }.join(',')
    e = row_totals.map{|i_row| "E#{i_row}" }.join(',')
    f = row_totals.map{|i_row| "F#{i_row}" }.join(',')
    [
      "Grand Total",
      "",
      "= SUM(#{c})",
      "= SUM(#{d})",
      "= AVERAGE(#{e})",
      "= AVERAGE(#{f})"
    ]
  end

  def render_total_page_row(i_begin, i_end, row)
    [
      "= CONCATENATE(A#{i_begin},\" Total\")",
      "",
      "= SUM(C#{i_begin}:C#{i_end})",
      "= SUM(D#{i_begin}:D#{i_end})",
      "= AVERAGE(E#{i_begin}:E#{i_end})",
      "= AVERAGE(F#{i_begin}:F#{i_end})"
    ]
  end

  def key_unique_page_path(data, header)
    i_path = header.index('ga:pagePath')
    i_source = header.index('ga:sourceMedium')
    path = convert_page_path(data[i_path])

    "#{(data[i_source] + path).parameterize}"
  end

  def convert_page_path(url)
    path = URI::parse(url).path rescue ''
    path = path[0..-2] if path.size > 1 && path.last == '/'
    path
  end
end
