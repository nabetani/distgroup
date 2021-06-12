require "date"

LIST = DATA.to_a.map(&:strip)

def line(memo,w,n)
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
  LIST.group_by{ |x| x.split("　").first }.each do |k,v|
    next if v.size<2
    memo = k+"家"
    w = 1
    f.puts( [memo,w,*v].join("\t"))
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
紀　貫之
紀　友則
源　兼昌
源　重之
源　俊頼
春道　列樹
小野　小町
壬生　忠見
壬生　忠岑
清原　元輔
藤原　基俊
藤原　義孝
藤原　興風
文屋　康秀
文屋　朝康
凡河内　躬恒