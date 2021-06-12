require "date"

LIST = DATA.to_a.map(&:strip)

def line(memo,w,n)
  p [memo,w,n]
  list = LIST.dup.shuffle
  c = n.map{ |nn| 
    u,list = list[0,nn], list.drop(nn)
    u.join("\t")
  }
  [memo,"%.3f" % w,c.join("\t\t")].join("\t")
end

def rel(x)
  File.join( File.split(__FILE__).first,x)
end

File.open(rel("../intermediates/sample.txt"), "w") do |f|
  f.puts(["members", *LIST].join("\t"))
  [
    [ "ほげ", 1, [3] ],
    [ "ふが", 1, [3,2,2] ],
  ].each do |memo,w,n|
    f.puts( line(memo,w,n) )
  end
  10.downto(0) do |ix|
    memo = (Date.today - (ix*14)).to_s
    w = 0.9**ix
    g = LIST.map{rand(6)}
    n = (0..g.max).map{ |e| g.count(e)}.select{ |e| 1<e }
    f.puts( line(memo, w, n))
  end
end

__END__
阿倍　仲麿
小野　小町
文屋　康秀
凡河内　躬恒
壬生　忠岑
坂上　是則
春道　列樹
紀　友則
藤原　興風
紀　貫之
文屋　朝康
平　兼盛
壬生　忠見
清原　元輔
曽禰　好忠
