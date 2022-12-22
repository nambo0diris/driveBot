<?php

namespace Fork\ImShop\DeliveryHandler\Deliveries;

use Helper\Log;

class spbcourier {

    const TIME_BORDER_INTERVAL = 19;
    const TIME_START_DELIVERY = 10;
    const TIME_END_DELIVERY = 19;
    const WEIGHT_BORDER = 20;

    public static function getDeliveryPrice($arOrderParams) {

        $spbzone = ($arOrderParams["spbzone"] ?: 1);
        if ($spbzone) {
            $arPrice["price"] = 250 * $spbzone;
        }

//        if($spbzone){
//            $zone_price = [
//                1 => 1000,
//                2 => 1500,
//                3 => 2000
//            ];
//
//            $arPrice["price"] = $zone_price[$spbzone];
//        }

        if ((int)$arOrderParams['weight'] >= self::WEIGHT_BORDER) {
            $arPrice["price"] = 0;
            $arPrice["priceLabel"] = 'Индивидуальный расчёт';
        }

        return $arPrice;

    }

    public static function getDeliveryTime($arOrderParams) {

        $arTime = array(
            "min" => 1,
        );

        return $arTime;

    }


    /**
     * Устанавливает интервалы доставки
     * @param $delivery
     * @param array|null $paramDeliveryIntervals
     * @return void
     */
    public static function setDeliveryIntervals(&$delivery, $paramDeliveryIntervals = null) {
        $zone = $paramDeliveryIntervals['zone'];
        $weight = $paramDeliveryIntervals['weight'];
        if(!$zone || !$weight) return;
        if($zone === 3 && $weight >= self::WEIGHT_BORDER) return;
        // todo вынести в отдельную функцию
        $nameDays = array( 1 => "понедельник" , "вторник" , "среда" , "четверг" , "пятница" , "суббота" , "воскресенье" );
        // шаг доставки, зависит от времени создания заказа
        $step = (((int) date('H', time())) < self::TIME_BORDER_INTERVAL) ? 1 : 2;
        // массив на ближайшие 7 дней
        $dateIntervals = [];
        // счетчик количества добавленных дней
        $timeAllowed = 0;
        for($i = 0; $i < 9; $i++) {
            // если собрали 7 дней, то заканчиваем
            if($timeAllowed == 7) break;
            $day = $i + $step;
            $dateDelivery = strtotime("+{$day} day", time());
            // доставка только в будни из-за весовых огрничений
            if($weight > self::WEIGHT_BORDER && (date('D', $dateDelivery) == 'Sat' || date('D', $dateDelivery) == 'Sun')) continue;
            $subTitle =  (($i == 0 && $step == 2) || ($i === 1 && $step == 2))
                ? 'послезавтра'
                : (($i === 0 && $step == 1) ? 'завтра' : $nameDays[date( "N", $dateDelivery)]);
            $dateDelivery = date('d-m-Y', $dateDelivery);
            $dateIntervals[] = [
                "id" => $dateDelivery,
                "title" => $dateDelivery,
                "subTitle" => $subTitle,
                "timeIntervals" => [
                    [
                        "id" =>sprintf("%s-%s", self::TIME_START_DELIVERY, self::TIME_END_DELIVERY),
                        "title" => sprintf("с %s:00 до %s:00", self::TIME_START_DELIVERY, self::TIME_END_DELIVERY)
                    ],
                ]
            ];
            ++$timeAllowed;
        }
        $delivery['dateIntervals'] = $dateIntervals;
    }

    public static function formatLocations($arOrderParams) {

        $arLocations = $arOrderParams["locations"];

        return $arLocations;

    }

}