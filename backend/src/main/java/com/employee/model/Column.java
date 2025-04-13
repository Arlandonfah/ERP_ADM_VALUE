package com.employee.model;

public @interface Column {

    boolean nullable();

    boolean updatable();

    boolean unique();

}
