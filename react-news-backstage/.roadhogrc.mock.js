import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getFakeList, getCollectionList } from './mock/api';
import { getFakeNewsList } from './mock/news';
import { getFakeUserList } from './mock/user';
import { getFakeChartData } from './mock/chart';
import { imgMap } from './mock/utils';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 获取用户详细信息
  'GET /api/userInfo': (req, res) => {
    res.send({
      status: '200',
      msg: '获取用户信息成功',
      data: {
        uID: '2',
        uName: '刘凯龙',
        uTelNum: '15147153946',
        uAvatar:
          'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8KCwkMEQ8SEhEPERATFhwXExQaFRARGCEYGhwdHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCW3X5eQDjmrKgcggj2zUMK5Ax0/nVkA8gViagqgc8+lKV4xinADI4z+NOA65P4UW7CZEQABxTSBj7p6VMy8g5/PigJyOD1osK5XaPJyfwqB0HcjPY1fdQR24qMxsVLbTigRQfrjriuG+K+r32j6H5tkVUysY2c8Fcg4xz1r0GRMDOBXE/FDS4tQ0F5HCsbY+aqHo2Acj8iaI2uDeh4ppXiDV7S/W5iurjduAYuxYEehzXu3h+4lvdMgnl2eY0YZtpyMn0ryvU7rRobS7t44IQ652bmX1OB156CvSPBbwJoNskU8cgVAuQwYZ7itJiTN8fUH3oKAjrWfqOuaTpsQe+vYYAzbQXbHNWrS7guFWWGZJFboUYEH8ay1C4/Yw6Dim7cDmrIO4ZJ6nimSJyT0zVJjKxTpwSKglQH2q4V9OahkUE5xwaBHM+KR/xJrrJ4AHH4iuT8OI51dZMDabY5785H+Fdh4pAXRLzIz8n5ciuZ0YKuutGn3BbnaB0+8Kl7l3VjoQvy9RXAePYwNTdlO0lFycdOv+Feilfk9QO1cB8RIy18wBP3EPH/AAKnLYcNzo/B6Y0S19fL6+pzW6y/uH6Dv0rG8HIRoFlx0iGea3mA8hl9OlNaie4224TpnjpRUlkAWUHjtRSt2HypnewqQQQMY/SrOP7q56ZxRDHkY71YSMhiOg9+adgZFjJ+VeadtPVuaseVxnGabsI9qNibkBXPHpTSApH8qsmN/l/dtlvu8dajKnPzDH1pCIucZNQyLELkXWZPMWMxgBztwfUdM+9TuOD3x61438cPH0mmj+wtHuVFyw/0h1OWiH93PYn9Ka12Bmz46+KGjeHpms4Y2vrtR8yIwAQ+hPrXkHjL4la1r4MMQXT7cghkiY7m+priLiRpZC8jlmJySTnNMPStFGwh7zSP952P1NXNK1a/0uYS2VzJCQc4VuD9RWdS9aYXNXVdc1DU41S8naQKc/4U/S/EGpaaqC1vJ0CnIXdlfyrH6UZoBM9c0b4wSQxrHfab5hGAXjfB/I1taT8WtMubsRahZvaRucLIHDgfX0rwmjJpcqC59b2dzDd26TwSK8brlGHQinOuPXHavA/hv41uNAu4be9uml02T5WQ5Yw+49vavd7S8tr+0S6tZVlicZDKcg1MlYEYfikZ0a8B/u9+nWuR8Ouz6+zEbd1rkAfVa7HxKM6Red8r+XNcloY2eICNm3Ntxx15U1nd3LWx1eMoe1cF43U/2s5z1hQD6/NXoGBsB49RXFeLYBJrMjHG1YVYj/vr/wCtTkOHxG74VX/iT2oAAxGOBW22DA3Pb+tZHhdf+JRbjuE/Lmtkg+Q3B6Cq9Ae7GWmAykjgEc0U63XgYNFK4KVj02JVAyD+dTiPb/SnRIMdPrU8cXynmm9BPUhUZI4xxzXnvxb8W3ujINL0o7bt03yzD70akHAHoTjOewx68elmMDoMV5N8T9Lg/wCEvuJ5YppGkjidMvtUr5ajjAzwQR17VcEr6kHjN1eXc8pnmnmeRjuLuxYk+pJruPhr8Q77S9Rh0/Wrl7rTJiELyks9uT0IPXaO4/Ks2/srKOVgunxKAOpaTv8A8CxWZc2FhsZ2hmgI/ijk3AH6EZ/UVo433Hoe2/FHxVbeFPD81xIwa7kBS3jHO98dfp718kahczXl3LdXDtJLI5Z2bqSTzXR/EXxNdeJNSgeWZ3gtLdLeIHjO1QC2PUkVyhJOazUbAxDk0nSl5H40BSaYhBS49afHGWwvrVj7G5hL7e/FJtIpQbKfOMUGrtvaPIXToynBpbuwkt4VdgcEc0uZbD9m7XKFFSbGJAFNYEHGMVRFmNrpvAviq/8ADuqRslw/2N3AniJypHrjsa5mlXAIzQI+mNWuYbrQpri3kWSORAwZTkYNczYoyeIkBPK2hyOv8QxVXwG8cnw/uPLbIRSMHqORVnTFx4ncB93+jn8PmFYvctHWgnYCB/D3rk/EyD7XeybQ22CPtyASRXXhfkHfIrkvFLiO7vgerQxDj/eJP6ClLYqO5reDwTodrnGPJHSt11/0dqyPB6f8SS22qR+7HB61tTL+5fNVFCloyCAHjAop8Cnbk8cUUgsj1iNPbpU6KRjHWiGM4H0qwqHIHQdeKqwMiCYkAYcfSqes+HbTxDDFay7YbpDi3nxnGf4W/wBkn8uvrnWCdzzVzT2to3l+0QecrRMoXtk9j7HofY01o7kHh3iPwdf2eqGwmtx5vm+UQp3DON3X0IOc1yXxA0W30LwRcatfyiJppGtbKBT80sgOGY+iqM/U4Fe++L9Du9cuYbq01SCwmRFVw9sWU7T8pXaeCAcYxjA+tfN37T+og+I9O8PwyiWHSbJIy5UKWkbl2Pfng4ycZrZSBanjjgsTzUQTPUHNaCwFyCMsD+lLJZuqLII/lNZto05blHymIBC8k1cSyfzFUqeEL/pXRaR4fkufIjCnLkHPtXdWXgYytNKEwZIjGvHrWMq0UbwoN6nmGlabI2JSpKleK6eXQZFtEzEx5BHGO1elaR4LihFrE8YwkW1jjqa6c6DaCPBCkgcVzSr3Z0QpWR4ba6BNb6llojtkXP41b8Q+H5GsI1SPDbhxjsK9WvdKty6llAZRwR2qC5s4nXaVDAD0rN1pXuX7NJHiFv4blE5LR8Bs49KZrHh50hLomHwSQBXrtzYQocrGAax9Xska3k+XLYI4HFaLENsiVGNrHh80TxsQwINR102u6YI5mPABPTHIrn5Y9hxkda7oS5kedKFmdb8MNSlhvLzTizmG5t2wo5AcdDXfaOpPip+hJiIJHruArzj4bKDrkrMSFW3c5HqMV6XokiTeK/lTaRAcjPT5h1/Oon8SHHZnb+Udi+tcR4ytg+pXMh6RQRHGfVyOlejNF+749K8/8dkQ6lcjPzPbwgD/AIEx/pSktAg9Td8Gpu0i3PQbOlbcsf7hyePrWX4CjL6FbE8/uxnPWujkg/0eTI7flVR2JluZMCjHcYoqeKPk0UmlcLs9dji4HFWETsAadbRkqCe9W0jAqgZAY/ajbzVkpyCOlBTpQIqbT3HFfLf7RvhOaz8Q3GrvIGF7JuQBegAHU/lX1aY+OmK4j4xeGB4h8ITxIgaeAF4+5z6U09QufK3w60KPUp53nZv3e3j1616FY+B7EgiVAyMTwfQ1ifC+1e01HULSVSrRlcgjHrXqcKcA/wD1q4a85KZ6dCEXHYx9J8J2VoYDFuxGMc+ldVaWqIdir06U63jG3dg/hWrBAAA23qM5Nc6be502SIYoYx2+b1qteoqggKARnmr7owYZHHr6VSukhUNLNMqRjuTiizYXSOeu8+YVEZOe9VJozsBVT/Wq2s+MdDtZ3jikEzL1I5GfrXP3XirUbpQ9naTGPsVQ8itVQbM5VV0Ne6AOFOfrWZdRAqw+8MdqqxeIZJIiL2xuEJ6PsIFXLS4hukDIe3FQ6bjuTzKRwXjHTWjHmYOxvfpXnt3E4kYdcV7b4htVmspVKZ+XgYryHUIwshUqQwJGDXZh53VmclaCuXfh4wXV5x0JtnGfy/wrv/DW0eIZHUk77YsPXO4f1rgfAEf/ABMrhicbIW7V3Xh/aPFM6KWIW3Yc9B8y1tK1znWiO7i1SZF2E5471xnjq4a41WRzxiCMk/iw/rW9KQMe9cl4tkPnzoo3O8UQAz0+Yn+gpNhDc9K+HWP+Efty3QoMGuqliBs5SvIAzXJeAyw8PWuRk7R/KusVybKQYP3auJEtzLhQ85zmirMADKxopMEeu2YGwf4VaGCOtVrQZjU5AGKtJxz2o9Cmx4GRux+GKR0De/H0qQdf8aMA8/lRckhK5HXt3qCZVaNo8BsjHIqzu3kjBAFBjHtijcTVjwnx/wCH4/D3ixtYWNUt7yEiQ5/jVsg/kT+VczL48s4nCJbySKD1UV6/8btFOq+F4tuQIbhXfHUryD+FcPpfh3R44kV7ONiB3Ga56yjGV2duHlJxsiv4c8b6XfKIX8yNzz8ymu0stQiuEUxNlcZzjtXPXHhzRkUyxwIhHOMcUWhW2bELgoO2elc8nF7HXHm6nTX0/wDozbDggHmuI1q3k1G3NvIVZSxLYGM/4V0YdPsrzPKFQDLM5AAH1rnJtVtnO60LXC5wJE+4foT1/DNKLaKdiPQvBmlRyrPcwrIQcgN0/Kugv7TToUASKMDHTHSufh1i/ltr250+2inazRi8UrMN5HUAAg5rhI/EPiDxL4gdHklt7UKeIYtoHoPc54rdU5SV2zndSKfKkd1qUVkY2AjQ8+grIjtreAySKI1Hriqlj4du5T/pcrOf9rBzXO6/pOovJfafBNMIYZ1xukJUIy5x7/SphZuzZU7rVIt+Jdf0u2geJLhZpuRsj+b8z0FcJo2jz+JNXWIzIi7xvIGdo/xxXW6L4Wt4B5l0hd+24cflUdrA2i6jd3NpGF3ruQdgf8mqTjG6juQoyk/eN/RvBWi2G8WsdzIZQUknz8p55/X0FUf7KuNN8ZEPJvhltnMbeoBUEfWvSNCeO58N29xDtTaBlAc4Nc946lQeJtMtlChvsU0je+XTH8qdOb5rMuvTiqd0jLmxn2xXH+JpHXWn4B/cJ17fN/8Arrq5W+bjJrjvFZI1hgrYJt1B/wC+ia3ZwQPVPA4/4p+15H3B0rrAB9gl5HTiuQ+Hxz4ZsT1/dgGuyQf6FLng7auNrIze5StAdmOeaKksuAccUUrAeq2LboEYDORV5QAc4/Ssvw6/m6VbSH+KMH9K1kUADHNA3uOXnBI607oeOlKoz0zTuvbFGpOpEQOBjGTVDxDrGmaDpr3+qXaW8CcZY8sfRR1J9hWk33c9SDXM/E/wp/wmHhWTSkuFt7hZFnglK7grqeMj0IJHtnNUl3Eea+KfizHq7zaJoei3NxcSkxqpQySE9PuKQB9dx+lcvrFzr1vGkdvLKJs4cFVVYz3GMEn869k+Gmk6fZaDHcQ6XFZ375W9O0+YZAfmBY84746elctqWn5129XaMfaJCDj1bNc+Iel7HXhV7zSPOPEf/CRQ21nPpuoyXqyLiaISFHR/p6dqhkfWY/D0UupXc2nySzqjvGcsik4+uelepJpbuyoQoX1AwaoeMfDtvc6XHF5atslVyT7Hkfjiuf2ytsdXsGne5yFv4am17wrJZ3WvarNEAzQrNOSobJwxU8E5/Ss7wprktlfR2WoWWQziBlUZaNhweemP6c122mFbKzFuvYY+tYl5b2i373cahJHI3n+9Uqba9415EtYnUT+HIZcSRwp83OCtTQaS0QAESR8YBVRnH1qbRtYhlhVRJuIG3gE1anvR/wAsw/tkVLvtcvlW5VGmJGn3B17965zW9JiOoyMMq7kO2DwcAYreurm6K48wKPbk1i3UoiaR2csWGTk5ppWCxzmrKEXOORnpXOXcsccnmSDKYwQRXQ6xcKVOCOQSMVy8rF5kwASWG0H61djHqel+EpYpNGKCPYWwMFcc1594q1OO/wDihLHC+Y7WzMAIPBYEFv1P6Vu6veXGmaU0kbrHO0RPH8OBXm+guR4leRydxt5Cxbr95a0pRfNczxFRcvKjoGuT/aawgfKRj6VzniwyJrqyKDtWFMg9Dya2tMy10zvuJHf1rovDnhux1LVJtS1FRLGoVEiPTjnJ9etbzfKctGDnKyNr4fOF8P2alAAUB4FdH4kaUaEXtRqBcSLuFkU8wD1O/jHr3qube1sWiS1RYocYCjoKm1qJbnw/cJ9vnslQB3kgOHKjkgHtnpWtOSaM61N05WZkx6ncabpv2m6kaOGBGmuGuSpkCY+Vfk43E/Xp6mis25m0uKKBpyU06yO5oyS7XEoYrGmOrHIZsdztNFacqMz3TwNIJvDWnuAfmgQ/+OiuiTHXHSuR+F83neDtMfP/AC7x4x0+6K7BOOQePasbFy3HxgcHHA9KUg9RzQCCcA/WnAkk5NPbUhsbzznGfalUZQD9KXjIwf0oU9QaEIoXFpMl4bm0MZDqBKjnbkjowODz26enpXn+sSvHrd0pi2/vDkE55716iQdvrXBeN7LydcjuVXCTryf9ocfyxWNePu3OnCT9/Uo2Jkl5CInpuOTUOvp5drl3LOeFHbNaVio2Dsaz/EeYx5jAPsBwo71ws9jQy7bSTNbsVK5C5yTiud1PTC7H0+taC6xJJblVTLgcqrZIrnLmfU768Yoz2tsv33wC7n0AOQPrTSM7mffvcaLcR3UcjbNwDrnqM12djqIkiXepP061xs9nNeXK/a5MxIwITqWx61uLKgjyh+YdRnrTGa1/cLlmHB9zXPancBjuB5qee5Voyc59RWLeyEr1x6Yqr6ESbKl5LuDKTg9uKxolSS9RGyMHIwcdOlXZpPny3NUrBXn1ZI0BLc5x7A04LWxjPSNy7rFxI9hN5js/7sqSecDFcVojiTxK8ZfGbd+3TJFdXqYdYJkcYGDx+FchpLIPEoIAGYWGRx6V2WRwJt7s6yLbFEik5wepPWtjwxqoj1C4sWbGEWVffOQf5D865wyDb689qyLrVf7O8SQ3RJCFFR8f3SxH6dfwqZptGtCXLNM9gmuzNCw3DPBHtWTrV/PcabDAjlMXKNLzjKpliPxKgfjWbbXclwQYm+U/xetVfEktzZQQXECmVPNVZR32tlc/mRWdKfK7HXi4KauR6DqYmuoY7dYJNQtrWKSKO5JUOzrmQq3ZsbRnHHPrRWZaX9q+iWbXtiLmK3RPMK/6yD5ceYuOeCCDjnjNFdiueafSfwYkMngywUnOIlH6YrvI17HNeQ/A3UinhmKNmwEBBz9a7iXxrocV4tity91dt/ywtYWmb8doIH4moV3ohyVjqVJHHT1p4I/Tiual1TxBc2ck2m6ALbbwranciEE/7qBz+eK5RbH4n6xcMb/X7HSLPJ+XT4dzsPZnGR9c1ainuzJ3PUM/KO9LkfU15bq3hbSrC2+06/4u1yVCcFrrVCin24x+QpLPRvCcsAksLWyuYz8okaT7Qf8AvpieelS+VbMfJJq9j1IuBwSeK53x2iPpazbhvhkVsZ7Hg/z/AErzHxbrPhDTIJLO7VbiTO37PbHBB9yCAv515Naarpmla4+qW2lTsN2Y0kvXbyxjBAOOfxzUycHFps6qGFrNqUVofRljKhiUgnOKy9euByGAP1qDw9epe2UNzA+6ORA6e4PSs7xRdNaqXEMjsRyFPSvJ1vY9VaIybuZIiWBQMeck8VjvdGFZTJMuS2cKMis6V9RvZ9wMcYJ/iJYgVBdaTeSSKrXHHftWqg+rKUepI+sWqSHzZQpHTIxVWfxFp0OWE+9v7qZJqhfaMiSbVUyN6k5z+dSWGhfvFaRQQP4R0FDUV1M5I3NNujeQiVVKAjo1V79ic4IFWI9sKbIuAOMVQunySehNK5m7lG6PyucgYqTwW8S6+00zqqxwsQT6nA/rVK/mwhwfrUOj2d1eRzSwSRAg7cMcfqAcda2pXbMKz91m14xe2a0uChQko+Md+K820x9viJBjH7puc12c2i3F1A0ZuoFlZT5abiQfx9Kwr/wtqelP/asTJeiNCrRRZDAeo9a69zhWhPNNhCBwQfSuX8VSj7UNxyCij9TXUafpep6jaLdJZzRK/QS4jP5HmodQ8Ca3qNwjmW1gjC4Jd8nr6AGi3QaNvwXdtcaFbsxzIFx/hW4WEsTJKAQRjFZekaF/YOnIsl8smwBWXbtB57c06QvO4f5iBwFArknG0mehRlzx1MPUluNElFzZxNcom4SQg8tGSTx7qT+RoreltIwnn3CSSCPL7IyA2MHgetFbQqJrU5qlF82h9AaH4b8PfD7QB/aeoksoLSTzcFz1wif05NZt78VvCdqiSWYupX/uLByvsS3H5GvJ7jQfGGq3YW40zV7m4wF/eQyMw/McUSfD7xel7Fav4e1KN5G2qzwNs/Fvuj86JSb1PQhgaMV78jub/wCM8k8mLXQyyfwmWfj/AL5C4FXo/iB4xv7N20vwVdysV+V1jkkQe+Av9a6P4bfC3S9AWK+1iSG71EDIB5SI/wCyD1Pua9Y0+K3ZMBlAHXFNX6nJWq4eLtTjc+SdZ8K/EnxJcNfaho+pyuc4MqiMKPQKcYH4VlHwv420VZEj0nWYfMXbIYonKsPfbxX2ZdxL1j+UdOayZUiVv4S1Fghj3FW5UfJ/h3wB4o1u8WEabcWyE5ea5jaNFH4jk/St3xX8IxYWG2HV2kusZ2vDhGP4EkD86+kIrdXcE9O/Nc/4217wTpFuV8QarYQuvSIvul/BFy36VUKd3aKFVzKo3pojx34a6b4g0PSXtdWhCwRyfuXEobg9RgdB/jXUX0SzxlWwwYcVQPxE8FXcklrptjq92hBXzYrTKD8SR/KpbC+W4iG3cvddwwcehrlxOHlTd2rGmHxHtb3MqXTIoSXEWCP1rGvLOad2IlYIvGAcV1N7IxfHXj86ptAu3B+UZ5x3rni31Ou+hzn9kqiB3Iz29aHj8qPAAHrWxdK6xkHp2J7ViXMhwfm5PGaq2pm7IqXBCrnr61lXMoyV/GrF/cLGhLNgn3rnL68BB2sBQk2Rcj1GbJPORXE63PLHqUuyRlBUD5SeRiullmMv3fXr61r6BaWV2IfPgiMtvJ5oYqN3TA/r+QreDWzIlPlVzzVJJVKku4xyME8fSrVtqupQyBob65VhnH7w17GfKMJ3RKwY4IIyMU7TdH0Uid306zIYZIMK8/pWxksSuqPJbfxNr0UbxpqtztY5Idt3PsT0/Cq8+r6pKcy6leNn1mbH869YtvDfh6CVlGl27I5z8434+melSR+GdAS4Yf2VakZ7rmhpor6xTXQ8gm1DULloopbq4n2HMau5bB9s16l4bubi60uBru3khmC/MHQqT7jPatKDQtJ07VRNZWMULOuCV9Pb0/CpNRzNI5iGfKHP+73qZq6BYhN2SGF1AOePworNnmIcooJb2xRWKR0LU+wdX17TNJ02bVp5FghhUl5JBuI78AdfwrwnxF+0GHvZP7M0N7iIE7Zp7jYT77QDgfjXU+CJNY1z4bXmr+IJCTcB1EuAGWIjAHTG48ngYxg1weneFPDUf7xtIifB+UO7t+eWwa9DCSpxlNVY7aI8mak0nFm1p3xX8TzxLcSeB7mSCSIzRypMVjKDktuZSP1re0b4vwmNTJ4d1yF26LsjCn6FmXP5VRvdLtE0mJY4hb7V+RFztUegGcCudtbG5muhPNDL5Sg7GUFgcUOcXf3UCg+52OtfFXWpowdN8J6hMOxmuIowD+BNc3P47+JNw5Fvoml2J4wZ52fH/fNWULRqoMThTyMqa1NPtTeMrx5JBw25MVPtEuguU5HWI/iHrwWHVfGBijI5gsY9ifQkbSR9c1hzeCfDug27ahrF3c38/WOF2Cqze4HJ/E16jqbx2I+z2sSy3b9FHQD1Y9gK4b4gadK9tHcAGR/LLGQ9+34DkU3iaijaLsio04t6ieD5LXMk+rmCGKPAW0iXGMjjgdelaV5qsd3cIltaLAi52nox/AcCvLvB2tLZzTC8XcsrZLnkr6D6V2EN6kt2jQOgx3PTFcFSpJ6M9CnSSdzpYbxGbZONrYxkjGadcXMKRkA4A/GoI7m0kAjvIg2R94US6LZXKEwXroD2PIrnUkdHL2MjUtUSQvEu4DH3u1c5qWrRRZ6MenFdHeeFHfOL5evI21RPhWJAWlmjkx6g/wCNVzJk8rZwl3dXF7MRHGzdsAVUntvL/wBexDdkU5NdbrUVvZxOvnsAP4VAUfpXMBTK5dF2p6kdatSvsHKUnQouMBeeAKtaRK0OuWZV9octG4xwRjP9Kr3fySZPTNLoga71+JIgdkSl2bHc8D+ZrSO5jVtZnbzRDAVWyD0wKCHMAjHHv61ZVEiVSTk0NtkfoR64roS6nAyAyMU9WHHNLeagsMiyuspUAZKRs5/JQafNGBhVwSaECqQGYH6U9EFjJ1fxjY27I6WmpS/IRlbR1Cn/AIEBXBeIPHWpC/b+x7mS3tyuGV4lyx75yDXqRcb+wB61Za1t7hQssSSA/wB9QauMop7Cd+hzWnXMclhb3uADJErnnkZFFWdZtYrWQRRKkcZwURRgAew/CiuN6Nnp03eKZ9MfEWe3sNCt/D2nwpBBHgLGgwFA7VwNnb7GBPQGup1yC6v9WmnaFyFPyjFJbaDM2N4K8dOhrquectDKvZUnSFQf3YTaQBzmn6Y00cbRKJVRSeowCDXQx6LFAmG57jFXLfTVd/Ml+WMHIHrSuD1MLSbC7nvftHMcUZwM9xV+/wB0bLb2w3TS9/T3rbMeRsjGxB2FQpbqkm/OWAxu68VIjAbRYbOF2VzJNIMsx7k1oReHrbVtCRZY1YqDGQf0/pVwhZXYE/KPTqK2fD01pbj7NcSKok4Pt6GkF0j521fwdpuk+JntLm1VEuv3ts5Hyn+8vpkH+dakGjRRKESIADgYFe0/EXwRD4j0Wa0yIrhT5ttMOscnt7GvGrLUrrSLttH8SwtaXcTbRIw+WQdM5rmqxfQ7sPUTVmQy6WoB2Ej/AHaiWG5tScYdR2NdLMInj3IVIx1Bzmsu9IAx0xXOkddzKOoXK5U26H0IyKoXt5ceWzH5eOABmtC5ZAeKy7xlIKmnZiucRrCzz3W6QMRnox/wqtukCBPlUdsCuivoAWPAH4VkzxY4ReT0xWkXcTZk3EGcsQSenTJzXS+GtKSxt/MZR50vzOT29vwp+jaMyuLu9UbgcpH6e5rSun25RPvHjHoK6YKyuzhr1ObRDJpVZwB0xgCnQAleQfpT7a32IWPJqUABcgjmtTmZAwC9Tyf0qIj6nirBHquRTCuSRwPWjVjuQAZlB4zn1rSztUEemc1R2YYEg1e2bkHOKSFYxtbGWibByM/j0opNeYfa0hAJ8tATx3J/+sKK56lnLU9CjdRPrqdYQ3yqM+vpVNgCDgAGiiuk4BghRFDSnrwoPUmnsjO2Wwsa88jrRRQDK886KNsYJB4zULkRw5yAW9qKKBdSvboXkIU5BPPFV5HK34TBOMfzoopAdJZeLIrSRbTVUMcKqAs+0kKP9rHb3qbxR4Z8PeLtPAuIoLhGGY5EYH8VYUUVMtECep5Hr3wv13R5GbQNTM0I58qfggfXHP5CuXvLPxdaErd6E8p/vQsGz+VFFZciZ0QrTWhkyz3oPlyaTqEbn+HyWqtOt8wwul3vsTHiiio5Ejb2rGDRtSuR88K2yHr5jDP5CrMWmWmnpk/vZj/Eev4CiitYRSRhOpJ6Fae5eU7Yxz6joP8AE0QwBVDEHJ96KK1ZlImYArtGB+FNIAXGRRRVIT0Im6nnB9RQFwBkgn0oopvcENdQO3HtVyFw0QI7UUVPUZz/AIg41JnJ+8gI/l/SiiiuaTsz0KXwI//Z',
        uSex: 'MALE',
        uAge: 20,
        uDescribe: '你这代码写的也忒好啦～',
        uAuthority: 'ADMIN'
      }
    });
  },
  // 修改用户信息
  'POST /api/editUserInfo': (req, res) => {
    res.send({
      status: '200',
      msg: '修改用户信息成功',
      data: {
        uID: '2',
        uName: '我改了个名字',
        uTelNum: '15147153946',
        uAvatar:
          'data:image/jpeg;base64,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',
        uSex: 'MALE',
        uAge: 60,
        uDescribe: '你这代码写的不错～',
        uAuthority: 'ADMIN'
      }
    });
  },
  // 修改用户权限
  'POST /api/editUserType': (req, res) => {
    res.send({
      status: '200',
      msg: '修改用户权限成功'
    });
  },
  // 获取用户列表
  'GET /api/users': getFakeUserList,
  // 添加新闻
  'POST /api/addNews': (req, res) => {
    res.send({
      status: '200',
      msg: '新闻添加成功',
      data: {
        nID: '1'
      }
    });
  },
  // 获取新闻列表
  'GET /api/newsList': getFakeNewsList,
  // 删除新闻
  'POST /api/deleteNews': (req, res) => {
    res.send({
      status: '200',
      msg: '新闻删除成功',
      data: {
        nID: '1'
      }
    });
  },
  // 获取收藏列表
  'GET /api/collectionList': getCollectionList,
  // 添加收藏
  'POST /api/addCollection': (req, res) => {
    const { uID, nID } = req.body;
    res.send({
      status: '200',
      msg: '添加收藏成功',
      data: {
        cID: `${uID}-${nID}`
      }
    });
  },
  // 删除收藏
  'POST /api/deleteCollection': (req, res) => {
    res.send({
      status: '200',
      msg: '收藏删除成功',
      data: {
        cID: '1'
      }
    });
  },
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2
      }
    },
    $body: postRule
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login': (req, res) => {
    const { uPasswd, uTelNum } = req.body;
    res.send({
      status: uPasswd === '123456' && uTelNum === '15147153946' ? '200' : '400',
      msg: '登录成功',
      data: { uID: 2 }
    });
  },
  'POST /api/register': (req, res) => {
    res.send({
      status: '200',
      msg: '注册成功',
      data: {
        uID: 1,
        uTelNum: 15147153946,
        uPasswd: 'passwordishere'
      }
    });
  }
};

export default (noProxy ? {} : delay(format(proxy), 1000));
