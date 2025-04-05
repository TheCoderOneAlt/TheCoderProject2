def basit_sohbet_botu():
    """Basit bir sohbet botu."""

    cevaplar = {
        "merhaba": "Merhaba! Nasılsınız?",
        "nasılsın": "İyiyim, teşekkürler. Siz nasılsınız?",
        "ne yapıyorsun": "Sohbet ediyorum ve size yardımcı olmaya çalışıyorum.",
        "hava nasıl": "Üzgünüm, şu anda hava durumu hakkında bilgi veremiyorum.",
        "teşekkürler": "Rica ederim!",
        "güle güle": "Görüşmek üzere!",
        "python nedir": "Python, okunabilir ve güçlü sözdizimine sahip, yüksek seviyeli, genel amaçlı bir programlama dilidir.",
        "hangi dilleri biliyorsun": "Ben Google tarafından eğitilmiş büyük bir dil modeliyim.",
        "nerede yaşıyorsun": "Ben bir yapay zeka olduğum için fiziksel bir konumum yok.",
        "saat kaç": "Şu an saat 23:46.", # Güncel saati manuel olarak ekledim, daha dinamik bir çözüm için datetime kütüphanesini kullanabilirsiniz.
        "bugün günlerden ne": "Bugün Cumartesi.", # Güncel günü manuel olarak ekledim, daha dinamik bir çözüm için datetime kütüphanesini kullanabilirsiniz.
        "izmir nerede": "İzmir, Türkiye'nin batısında yer alan bir şehirdir.",
        "varsayılan": "Anlamadım. Tekrar sorabilir misiniz?"
    }

    print("Basit Sohbet Botuna Hoş Geldiniz!")
    while True:
        kullanici_girisi = input("Siz: ").lower()

        if kullanici_girisi in cevaplar:
            print("Bot:", cevaplar[kullanici_girisi])
            if kullanici_girisi == "güle güle":
                break
        else:
            print("Bot:", cevaplar["varsayılan"])

if __name__ == "__main__":
    basit_sohbet_botu()